import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Club } from '../../clubs/entities/club.entity';
import { Association } from '../../associations/entities/association.entity';

export enum UserRole {
  ADMINISTRADOR = 'administrador',
  DIRECTOR = 'director',
}

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.DIRECTOR,
  })
  role: UserRole;

  @ManyToOne(() => Club, (club) => club.users)
  club: Club;

  @ManyToOne(() => Association, (association) => association.users)
  association: Association;

  @OneToMany(() => Club, (club) => club.director)
  directedClubs: Club[];
}
