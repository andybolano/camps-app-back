import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsArray,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class UpdateMemberBasedEventItemDto {
  @IsOptional()
  id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicableCharacteristics?: string[];

  @IsOptional()
  @IsString()
  calculationType?: string;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;
}
