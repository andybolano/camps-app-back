import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCampDto {
  @ApiProperty({
    description: 'Nombre del campamento',
    example: 'Campamento de Verano 2024',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Ubicación del campamento',
    example: 'Ciudad de México',
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Fecha de inicio del campamento (formato ISO)',
    example: '2024-07-01',
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Fecha de fin del campamento (formato ISO)',
    example: '2024-07-15',
  })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Descripción del campamento',
    example: 'Campamento deportivo para jóvenes',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'URL del logo del campamento',
    example: 'https://example.com/logo.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  logoUrl?: string;
}
