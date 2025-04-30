import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Club } from '../clubs/entities/club.entity';
import { Association } from '../associations/entities/association.entity';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Club)
    private clubsRepository: Repository<Club>,
    @InjectRepository(Association)
    private associationsRepository: Repository<Association>,
  ) {}

  async onModuleInit() {
    try {
      await this.initDefaultAdmin();
    } catch (error) {
      this.logger.error('Error during module initialization:', error);
    }
  }

  private async initDefaultAdmin() {
    try {
      // Verificar si la tabla existe usando PostgreSQL
      const tableExists = await this.usersRepository.query(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user')",
      );

      if (!tableExists[0]?.exists) {
        this.logger.warn('User table does not exist yet');
        return;
      }

      const count = await this.usersRepository.count();

      // Solo crear el admin si no hay usuarios en la base de datos
      if (count === 0) {
        this.logger.log('Creating default admin user...');

        // Hash the password directly
        const hashedPassword = await bcrypt.hash('qaz123', 10);

        // Crear el usuario directamente sin pasar por validaciones
        const adminUser = this.usersRepository.create({
          username: 'admin',
          password: hashedPassword,
          role: UserRole.ADMINISTRADOR,
        });

        await this.usersRepository.save(adminUser);
        this.logger.log('Default admin user created successfully');
      } else {
        this.logger.log('Users already exist in the database');
      }
    } catch (error) {
      this.logger.error('Failed to create default admin user', error);
      // No relanzamos el error para evitar que la aplicación falle al iniciar
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, role, clubId, associationId } = createUserDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find club if provided
    let club: Club | null = null;
    if (clubId) {
      club = await this.clubsRepository.findOne({
        where: { id: clubId },
      });
      if (!club) {
        throw new NotFoundException('Club not found');
      }
    }

    // Find association
    const association = await this.associationsRepository.findOne({
      where: { id: associationId },
    });
    if (!association) {
      throw new NotFoundException('Association not found');
    }

    // Create the user
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
      role: role || UserRole.DIRECTOR,
      club,
      association,
    });

    return this.usersRepository.save(user);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
