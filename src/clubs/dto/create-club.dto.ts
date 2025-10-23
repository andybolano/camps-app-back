import { IsNotEmpty, IsString, IsOptional, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClubDto {
  @ApiProperty({
    description: 'Nombre del club',
    example: 'Club Maranatha',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Ciudad donde se ubica el club',
    example: 'Barranquilla',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Lema o motto del club',
    example: 'Unidos en Cristo',
    required: false,
  })
  @IsOptional()
  @IsString()
  motto?: string;

  @ApiProperty({
    description: 'Array de IDs de categorías del club (1: Guías Mayores, 2: Conquistadores, 3: Aventureros)',
    example: [1, 2],
    type: [Number],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds?: number[];

  @ApiProperty({
    description: 'URL del escudo del club (se genera automáticamente al subir el archivo)',
    example: 'uploads/shields/club-123.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  shieldUrl?: string;
}
