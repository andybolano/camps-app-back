import { OmitType } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCampEventDto } from './create-camp-event.dto';

export class UpdateCampEventDto extends PartialType(
  OmitType(CreateCampEventDto, ['campId', 'eventTemplateId'] as const),
) {}
