import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
  IsArray,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateMemberBasedEventItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;

  @IsArray()
  @IsString({ each: true })
  applicableCharacteristics: string[];

  @IsString()
  @IsOptional()
  calculationType?: string;

  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;
}
