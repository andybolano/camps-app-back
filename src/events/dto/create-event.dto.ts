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
import { CreateEventItemDto } from './create-event-item.dto';
import { CreateMemberBasedEventItemDto } from './create-member-based-event-item.dto';

export enum EventType {
  REGULAR = 'REGULAR',
  MEMBER_BASED = 'MEMBER_BASED',
}

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  campId: number;

  @IsEnum(EventType)
  @IsOptional()
  type?: EventType = EventType.REGULAR;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateEventItemDto)
  @IsOptional()
  items?: CreateEventItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMemberBasedEventItemDto)
  @IsOptional()
  memberBasedItems?: CreateMemberBasedEventItemDto[];
}
