import { IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCampEventDto {
  @ApiProperty({ description: 'ID del campamento donde se creará la instancia del evento' })
  @IsNotEmpty()
  @IsNumber()
  campId: number;

  @ApiProperty({ description: 'ID de la plantilla de evento a instanciar' })
  @IsNotEmpty()
  @IsNumber()
  eventTemplateId: number;

  @ApiPropertyOptional({ description: 'Nombre personalizado para esta instancia (sobrescribe el nombre de la plantilla)' })
  @IsOptional()
  @IsString()
  customName?: string;

  @ApiPropertyOptional({ description: 'Descripción personalizada para esta instancia (sobrescribe la descripción de la plantilla)' })
  @IsOptional()
  @IsString()
  customDescription?: string;

  @ApiPropertyOptional({ description: 'Puntaje máximo personalizado para esta instancia (sobrescribe el puntaje de la plantilla)' })
  @IsOptional()
  @IsNumber()
  customMaxScore?: number;

  @ApiPropertyOptional({ description: 'Indica si la instancia del evento está activa' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
