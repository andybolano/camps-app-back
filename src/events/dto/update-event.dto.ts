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
import { EventType } from './create-event.dto';

export class UpdateEventDto {
  @ApiProperty({ description: 'The name of the event', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'The description of the event', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The type of event',
    enum: EventType,
    required: false,
  })
  @IsEnum(EventType)
  @IsOptional()
  type?: EventType;

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
