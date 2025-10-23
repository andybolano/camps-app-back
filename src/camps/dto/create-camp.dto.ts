import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCampDto {
  @ApiProperty({
    description: 'Nombre del campamento',
    example: 'Campamento Nacional 2025',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Ubicación del campamento',
    example: 'Parque Nacional Tayrona',
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Fecha de inicio del campamento (formato ISO 8601)',
    example: '2025-03-15',
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Fecha de finalización del campamento (formato ISO 8601)',
    example: '2025-03-18',
  })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({
    description: 'Descripción del campamento',
    example:
      'Gran campamento nacional con actividades para todas las categorías',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'URL del logo del campamento',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({
    description:
      'ID de la categoría objetivo del campamento (obligatorio). El campamento debe estar asociado a una categoría específica.',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  targetCategoryId: number;
}
