import { IsString, IsDate, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { MemberType, MemberStatus } from '../entities/member.entity';

export class UpdateMemberDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  identification?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  birthDate?: Date;

  @IsEnum(MemberType)
  @IsOptional()
  type?: MemberType;

  @IsEnum(MemberStatus)
  @IsOptional()
  status?: MemberStatus;

  @IsUUID()
  @IsOptional()
  clubId?: string;
}
