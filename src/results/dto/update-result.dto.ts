import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateResultItemDto } from './create-result.dto';

export class UpdateResultDto {
  @ApiProperty({
    description: 'The result items',
    type: [CreateResultItemDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateResultItemDto)
  items?: CreateResultItemDto[];
}
