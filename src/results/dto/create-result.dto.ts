import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateResultItemDto } from './create-result-item.dto';
import { CreateResultMemberBasedItemDto } from './create-result-member-based-item.dto';

export class CreateResultDto {
  @ApiProperty({ description: 'ID del registro de campamento (club en el campamento)' })
  @IsNotEmpty()
  @IsNumber()
  campRegistrationId: number;

  @ApiProperty({ description: 'ID de la instancia de evento en el campamento' })
  @IsNotEmpty()
  @IsNumber()
  campEventId: number;

  @ApiPropertyOptional({
    description: 'Items de resultados (para eventos de tipo REGULAR)',
    type: [CreateResultItemDto]
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateResultItemDto)
  items?: CreateResultItemDto[];

  @ApiPropertyOptional({
    description: 'Items basados en miembros (para eventos de tipo MEMBER_BASED)',
    type: [CreateResultMemberBasedItemDto]
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateResultMemberBasedItemDto)
  memberBasedItems?: CreateResultMemberBasedItemDto[];

  @ApiPropertyOptional({ description: 'Puntaje total del resultado' })
  @IsOptional()
  @IsNumber()
  totalScore?: number;
}
