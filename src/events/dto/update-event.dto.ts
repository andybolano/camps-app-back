import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateEventItemDto } from './update-event-item.dto';
import { EventType } from './create-event.dto';
import { UpdateMemberBasedEventItemDto } from './update-member-based-event-item.dto';

export class UpdateEventDto {
  @ApiPropertyOptional({ description: 'Nombre de la plantilla de evento' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Descripción de la plantilla de evento' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'ID de la categoría del evento' })
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiPropertyOptional({ description: 'Puntaje máximo del evento' })
  @IsOptional()
  @IsNumber()
  maxScore?: number;

  @ApiPropertyOptional({
    description: 'Tipo de evento: REGULAR o MEMBER_BASED',
    enum: EventType
  })
  @IsEnum(EventType)
  @IsOptional()
  type?: EventType;

  @ApiPropertyOptional({
    description: 'Items del evento (para tipo REGULAR)',
    type: [UpdateEventItemDto]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateEventItemDto)
  items?: UpdateEventItemDto[];

  @ApiPropertyOptional({
    description: 'Items basados en miembros (para tipo MEMBER_BASED)',
    type: [UpdateMemberBasedEventItemDto]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMemberBasedEventItemDto)
  memberBasedItems?: UpdateMemberBasedEventItemDto[];
}
