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
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
      // Verificar si la tabla existe
      const tableExists = await this.usersRepository.query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='user'",
      );

      if (!tableExists || tableExists.length === 0) {
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
          role: 'admin',
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
    const { username, password, role } = createUserDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
      role: role || 'user',
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
}
