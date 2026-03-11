import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateEventItemDto } from '../../events/dto/create-event-item.dto';
import { CreateMemberBasedEventItemDto } from '../../events/dto/create-member-based-event-item.dto';

export class CreateCampEventDto {
  @ApiProperty({
    description: 'ID del campamento donde se creará el evento',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  campId: number;

  @ApiProperty({
    description: 'Nombre del evento',
    example: 'Nudos y Amarres - Campamento Nacional 2025',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción del evento',
    example: 'Competencia de habilidades en nudos y técnicas de amarre',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Puntaje máximo del evento',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  maxScore: number;

  @ApiPropertyOptional({
    description: 'Indica si el evento está activo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Items de evaluación del evento',
    type: [CreateEventItemDto],
    example: [
      { name: 'Nudo de Ocho' },
      { name: 'Nudo Ballestrinque' },
      { name: 'Amarre Cuadrado' },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEventItemDto)
  items?: CreateEventItemDto[];

  @ApiPropertyOptional({
    description: 'Items basados en miembros del evento',
    type: [CreateMemberBasedEventItemDto],
    example: [
      {
        name: 'Cantidad de Menores',
        applicableCharacteristics: ['MENOR'],
        calculationType: 'COUNT',
        isRequired: false,
      },
      {
        name: 'Cantidad de Adultos',
        applicableCharacteristics: ['ADULTO'],
        calculationType: 'COUNT',
        isRequired: false,
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMemberBasedEventItemDto)
  memberBasedItems?: CreateMemberBasedEventItemDto[];
}
