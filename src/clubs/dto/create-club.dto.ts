import { IsNotEmpty, IsString, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClubDto {
  @ApiProperty({
    description: 'Nombre del club',
    example: 'Club Deportivo Ejemplo',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Descripción del club',
    example: 'Un club dedicado al desarrollo deportivo de jóvenes talentos',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Slogan del club',
    example: 'Unidos por el deporte',
    required: false,
  })
  @IsOptional()
  @IsString()
  slogan?: string;

  @ApiProperty({
    description: 'Ciudad del club',
    example: 'Ciudad de México',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Fecha de fundación del club',
    example: '2020-01-01',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  foundationDate?: Date;

  @ApiProperty({
    description: 'URL del escudo del club',
    example: 'https://example.com/shield.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  shield?: string;
}
