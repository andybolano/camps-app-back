import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateResultDto } from './create-result.dto';

export class CreateBulkResultDto {
  @IsNotEmpty()
  @IsNumber()
  eventId: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one result is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateResultDto)
  results: CreateResultDto[];
}