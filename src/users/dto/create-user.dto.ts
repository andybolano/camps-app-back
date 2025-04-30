import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsUUID()
  @IsOptional()
  clubId?: string;

  @IsUUID()
  @IsNotEmpty()
  associationId: string;
}
