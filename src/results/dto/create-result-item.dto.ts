import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateResultItemDto {
  @ApiProperty({ description: 'The ID of the event item this result belongs to' })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  eventItemId: string;

  @ApiProperty({ description: 'The score for this result item', minimum: 0 })
  @IsNumber()
  @Min(0)
  score: number;
}
