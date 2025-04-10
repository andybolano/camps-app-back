import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateResultItemDto {
  @IsNotEmpty()
  @IsNumber()
  eventItemId: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  score: number;
}
