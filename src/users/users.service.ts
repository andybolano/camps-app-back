import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    // Inicializa el usuario admin por defecto cuando se inicia el servicio
    this.initDefaultAdmin();
  }

  private async initDefaultAdmin() {
    try {
      // Verifica si ya existe el usuario admin
      const adminExists = await this.findByUsername('admin');

      if (!adminExists) {
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
        this.logger.log('Admin user already exists');
      }
    } catch (error) {
      this.logger.error('Failed to create default admin user', error);
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
