import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCampRegistrationDto {
  @ApiProperty({
    description: 'ID del campamento',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  campId: number;

  @ApiProperty({
    description: 'ID del club',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  clubId: number;

  @ApiProperty({
    description: 'ID de la categoría (1: Guías Mayores, 2: Conquistadores, 3: Aventureros)',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @ApiPropertyOptional({
    description: 'Cantidad de participantes',
    example: 25,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  participantsCount?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de invitados',
    example: 5,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  guestsCount?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de menores',
    example: 3,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  minorsCount?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de economs',
    example: 2,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  economsCount?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de acompañantes',
    example: 4,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  companionsCount?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de directores',
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  directorCount?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de pastores',
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  pastorCount?: number;

  @ApiPropertyOptional({
    description: 'Tarifa de inscripción',
    example: 50000,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  registrationFee?: number;

  @ApiPropertyOptional({
    description: 'Indica si la inscripción está pagada',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;
}
