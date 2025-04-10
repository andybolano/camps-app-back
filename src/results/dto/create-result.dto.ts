import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateResultItemDto } from './create-result-item.dto';
import { CreateResultMemberBasedItemDto } from './create-result-member-based-item.dto';

export class CreateResultDto {
  @IsNotEmpty()
  @IsNumber()
  clubId: number;

  @IsNotEmpty()
  @IsNumber()
  eventId: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateResultItemDto)
  items?: CreateResultItemDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateResultMemberBasedItemDto)
  memberBasedItems?: CreateResultMemberBasedItemDto[];

  @IsOptional()
  @IsNumber()
  totalScore?: number;
}
