import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateResultItemDto } from './create-result-item.dto';

export class CreateResultDto {
  @ApiProperty({ description: 'The ID of the club this result belongs to' })
  @IsString()
  @IsUUID()
  clubId: string;

  @ApiProperty({
    description: 'List of result items',
    type: () => [CreateResultItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateResultItemDto)
  items: CreateResultItemDto[];
}
