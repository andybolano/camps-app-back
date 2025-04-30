import { MemberType, MemberStatus } from '../entities/member.entity';

export class MemberResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  identification: string;
  birthDate: Date;
  type: MemberType;
  status: MemberStatus;
  clubId: string;
  createdAt: Date;
  updatedAt: Date;
}
