import { PartialType } from '@nestjs/mapped-types';
import { CreateCampRegistrationDto } from './create-camp-registration.dto';

export class UpdateCampRegistrationDto extends PartialType(
  CreateCampRegistrationDto,
) {}
