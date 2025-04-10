import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateMemberCharacteristicDto {
  @IsOptional()
  id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  matchCount?: number;
}
