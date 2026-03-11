import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMemberBasedEventItemDto {
  @ApiProperty({
    description: 'Nombre del item basado en miembros',
    example: 'Cantidad de Menores',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Características aplicables del item (por ejemplo: MENOR, ADULTO)',
    example: ['MENOR'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  applicableCharacteristics: string[];

  @ApiPropertyOptional({
    description: 'Tipo de cálculo para el item',
    example: 'COUNT',
  })
  @IsString()
  @IsOptional()
  calculationType?: string;

  @ApiPropertyOptional({
    description: 'Indica si el item es requerido',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;
}
