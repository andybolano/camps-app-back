import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y devuelve un token JWT'
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso, devuelve token de acceso',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AY2FtcGFtZW50by5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NDU2MTAwMDAsImV4cCI6MTY0NTY5NjQwMH0.xyz123abc456def789',
        user: {
          id: 1,
          email: 'admin@campamento.com',
          firstName: 'Juan',
          lastName: 'Pérez',
          role: 'admin',
          isActive: true,
          createdAt: '2025-01-10T08:00:00.000Z'
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
    schema: {
      example: {
        statusCode: 401,
        message: 'Credenciales inválidas',
        error: 'Unauthorized'
      }
    }
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({
    summary: 'Registrar usuario',
    description: 'Registra un nuevo usuario en el sistema'
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    schema: {
      example: {
        id: 2,
        email: 'carlos.rodriguez@campamento.com',
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        role: 'user',
        isActive: true,
        createdAt: '2025-01-28T10:30:00.000Z',
        updatedAt: '2025-01-28T10:30:00.000Z'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o usuario ya existe',
    schema: {
      example: {
        statusCode: 400,
        message: 'El correo electrónico ya está registrado',
        error: 'Bad Request'
      }
    }
  })
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener perfil de usuario',
    description: 'Obtiene el perfil del usuario autenticado'
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil de usuario obtenido exitosamente',
    schema: {
      example: {
        id: 1,
        email: 'admin@campamento.com',
        firstName: 'Juan',
        lastName: 'Pérez',
        role: 'admin',
        isActive: true,
        createdAt: '2025-01-10T08:00:00.000Z',
        updatedAt: '2025-01-10T08:00:00.000Z'
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    schema: {
      example: {
        statusCode: 401,
        message: 'No autorizado',
        error: 'Unauthorized'
      }
    }
  })
  getProfile(@Request() req) {
    return req.user;
  }
}
