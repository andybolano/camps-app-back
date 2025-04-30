import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Club } from './club.entity';

export enum MemberType {
  BAPTIZED = 'baptized',
  NOT_BAPTIZED = 'not_baptized',
  ECONOMA = 'economa',
  GUEST = 'guest',
  COMPANION = 'companion',
  DIRECTOR = 'director',
}

export enum MemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  identification: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({
    type: 'enum',
    enum: MemberType,
    default: MemberType.NOT_BAPTIZED,
  })
  type: MemberType;

  @Column({
    type: 'enum',
    enum: MemberStatus,
    default: MemberStatus.ACTIVE,
  })
  status: MemberStatus;

  @ManyToOne(() => Club, (club) => club.members)
  club: Club;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
