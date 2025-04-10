import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateMemberCharacteristicDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  value: number;

  @IsNumber()
  @Min(0)
  matchCount: number = 0;
}
