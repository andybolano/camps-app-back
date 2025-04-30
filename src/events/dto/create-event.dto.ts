import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEventItemDto } from './create-event-item.dto';

export enum EventType {
  REGULAR = 'REGULAR',
}

export class CreateEventDto {
  @ApiProperty({ description: 'The name of the event' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The description of the event' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'The type of event', enum: EventType })
  @IsEnum(EventType)
  type: EventType;

  @ApiProperty({
    description: 'List of event items',
    type: () => [CreateEventItemDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateEventItemDto)
  items?: CreateEventItemDto[];
}
