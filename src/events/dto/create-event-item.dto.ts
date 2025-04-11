import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEventItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
