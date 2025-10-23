import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateEventItemDto } from './create-event-item.dto';
import { CreateMemberBasedEventItemDto } from './create-member-based-event-item.dto';

export enum EventType {
  REGULAR = 'REGULAR',
  MEMBER_BASED = 'MEMBER_BASED',
}

export class CreateEventDto {
  @ApiProperty({ description: 'Nombre de la plantilla de evento' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Descripción de la plantilla de evento' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'ID de la categoría del evento' })
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiProperty({ description: 'Puntaje máximo del evento' })
  @IsNumber()
  @IsNotEmpty()
  maxScore: number;

  @ApiPropertyOptional({
    description: 'Tipo de evento: REGULAR o MEMBER_BASED',
    enum: EventType,
    default: EventType.REGULAR
  })
  @IsEnum(EventType)
  @IsOptional()
  type?: EventType = EventType.REGULAR;

  @ApiPropertyOptional({
    description: 'Items del evento (para tipo REGULAR)',
    type: [CreateEventItemDto]
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateEventItemDto)
  @IsOptional()
  items?: CreateEventItemDto[];

  @ApiPropertyOptional({
    description: 'Items basados en miembros (para tipo MEMBER_BASED)',
    type: [CreateMemberBasedEventItemDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMemberBasedEventItemDto)
  @IsOptional()
  memberBasedItems?: CreateMemberBasedEventItemDto[];
}
