import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssociationDto {
  @ApiProperty({
    description: 'The name of the association',
    example: 'Asociación Deportiva Nacional',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The country where the association is based',
    example: 'Spain',
  })
  @IsString()
  @IsNotEmpty()
  country: string;
}
