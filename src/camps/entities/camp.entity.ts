import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Club } from '../../clubs/entities/club.entity';
import { Event } from '../../events/entities/event.entity';

@Entity()
export class Camp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  logoUrl: string;

  @OneToMany(() => Club, (club) => club.camp)
  clubs: Club[];

  @OneToMany(() => Event, (event) => event.camp)
  events: Event[];
}
