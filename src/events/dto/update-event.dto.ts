import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { UpdateEventItemDto } from './update-event-item.dto';
import { EventType } from './create-event.dto';
import { UpdateMemberBasedEventItemDto } from './update-member-based-event-item.dto';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  campId?: number;

  @IsEnum(EventType)
  @IsOptional()
  type?: EventType;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateEventItemDto)
  items?: UpdateEventItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMemberBasedEventItemDto)
  memberBasedItems?: UpdateMemberBasedEventItemDto[];
}
