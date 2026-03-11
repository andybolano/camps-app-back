import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventItemDto {
  @ApiProperty({
    description: 'Nombre del item de evaluación',
    example: 'Nudo de Ocho',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
