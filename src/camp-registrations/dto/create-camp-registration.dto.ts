import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCampRegistrationDto {
  @ApiProperty({ description: 'ID del campamento' })
  @IsNotEmpty()
  @IsNumber()
  campId: number;

  @ApiProperty({ description: 'ID de la categoría del club' })
  @IsNotEmpty()
  @IsNumber()
  clubCategoryId: number;

  @ApiPropertyOptional({ description: 'Cantidad de participantes' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  participantsCount?: number;

  @ApiPropertyOptional({ description: 'Cantidad de invitados' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  guestsCount?: number;

  @ApiPropertyOptional({ description: 'Cantidad de menores' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  minorsCount?: number;

  @ApiPropertyOptional({ description: 'Cantidad de economs' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  economsCount?: number;

  @ApiPropertyOptional({ description: 'Cantidad de acompañantes' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  companionsCount?: number;

  @ApiPropertyOptional({ description: 'Cantidad de directores' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  directorCount?: number;

  @ApiPropertyOptional({ description: 'Cantidad de pastores' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  pastorCount?: number;

  @ApiProperty({ description: 'Tarifa de inscripción' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  registrationFee: number;

  @ApiPropertyOptional({ description: 'Indica si la inscripción está pagada' })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;
}
