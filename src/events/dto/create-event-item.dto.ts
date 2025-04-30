import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateEventItemDto {
  @ApiProperty({ description: 'The name of the event item' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The description of the event item' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The maximum score possible for this event item',
  })
  @IsNumber()
  maxScore: number;
}
