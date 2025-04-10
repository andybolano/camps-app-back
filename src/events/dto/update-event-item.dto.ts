import { IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateEventItemDto } from './create-event-item.dto';

export class UpdateEventItemDto extends PartialType(CreateEventItemDto) {
  @IsOptional()
  @IsNumber()
  id?: number;
}
