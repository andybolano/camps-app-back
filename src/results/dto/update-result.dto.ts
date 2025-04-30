import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateResultItemDto } from './create-result-item.dto';

export class UpdateResultDto {
  @ApiProperty({
    description: 'List of result items',
    type: () => [CreateResultItemDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateResultItemDto)
  items?: CreateResultItemDto[];
}
