import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateResultItemDto {
  @ApiProperty({ description: 'The event item ID' })
  @IsUUID()
  eventItemId: string;

  @ApiProperty({ description: 'The score for this event item' })
  @IsString()
  score: number;
}

export class CreateResultDto {
  @ApiProperty({ description: 'The club ID' })
  @IsUUID()
  clubId: string;

  @ApiProperty({ description: 'The result items', type: [CreateResultItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateResultItemDto)
  items: CreateResultItemDto[];
}
