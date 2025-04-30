import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Camp } from '../../camps/entities/camp.entity';
import { User } from '../../users/entities/user.entity';
import { Member } from './member.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Club {
  @ApiProperty({ description: 'The unique identifier of the club' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The name of the club' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The slogan of the club' })
  @Column({ nullable: true })
  slogan: string;

  @ApiProperty({ description: 'The city of the club' })
  @Column({ default: 'Barranquilla' })
  city: string;

  @ApiProperty({ description: 'The foundation date of the club' })
  @Column({ nullable: true })
  foundationDate: Date;

  @ApiProperty({ description: 'The shield image URL of the club' })
  @Column({ nullable: true })
  shield: string;

  @ApiProperty({
    description: 'The camps this club belongs to',
    type: () => [Camp],
  })
  @ManyToMany(() => Camp, (camp) => camp.clubs)
  @JoinTable()
  camps: Camp[];

  @ApiProperty({
    description: 'The users that belong to this club',
    type: () => [User],
  })
  @OneToMany(() => User, (user) => user.club)
  users: User[];

  @ApiProperty({
    description: 'The director of the club',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.directedClubs)
  director: User;

  @ApiProperty({
    description: 'The members that belong to this club',
    type: () => [Member],
  })
  @OneToMany(() => Member, (member) => member.club)
  members: Member[];
}
