import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateEventItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;
}
