import { PartialType } from '@nestjs/mapped-types';
import { CreateAssociationDto } from './create-association.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAssociationDto extends PartialType(CreateAssociationDto) {
  @ApiProperty({
    description: 'The name of the association',
    example: 'Asociación Deportiva Nacional',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'The country where the association is based',
    example: 'Spain',
    required: false,
  })
  country?: string;
}
