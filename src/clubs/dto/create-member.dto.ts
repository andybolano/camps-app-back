import { IsString, IsDate, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { MemberType, MemberStatus } from '../entities/member.entity';

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  identification: string;

  @Type(() => Date)
  @IsDate()
  birthDate: Date;

  @IsEnum(MemberType)
  type: MemberType;

  @IsEnum(MemberStatus)
  status: MemberStatus;

  @IsUUID()
  @IsNotEmpty()
  clubId: string;
}
