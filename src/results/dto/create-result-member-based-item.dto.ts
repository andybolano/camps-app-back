import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateResultMemberBasedItemDto {
  @IsNotEmpty()
  @IsNumber()
  eventItemId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  matchCount: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalWithCharacteristic: number;
}
