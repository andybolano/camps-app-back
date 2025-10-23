import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateResultDto } from './create-result.dto';

export class CreateBulkResultDto {
  @ApiProperty({ description: 'ID de la instancia de evento en el campamento' })
  @IsNotEmpty()
  @IsNumber()
  campEventId: number;

  @ApiProperty({
    description: 'Array de resultados a crear en lote',
    type: [CreateResultDto],
    minItems: 1
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one result is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateResultDto)
  results: CreateResultDto[];
}