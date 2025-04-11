import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateMemberBasedEventItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

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
