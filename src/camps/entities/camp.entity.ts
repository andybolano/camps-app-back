import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Club } from '../../clubs/entities/club.entity';
import { Event } from '../../events/entities/event.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Camp {
  @ApiProperty({ description: 'The unique identifier of the camp' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The name of the camp' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The location of the camp' })
  @Column()
  location: string;

  @ApiProperty({ description: 'The start date of the camp' })
  @Column()
  startDate: Date;

  @ApiProperty({ description: 'The end date of the camp' })
  @Column()
  endDate: Date;

  @ApiProperty({ description: 'The description of the camp', required: false })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'The URL of the camp logo', required: false })
  @Column({ nullable: true })
  logoUrl: string;

  @ApiProperty({
    description: 'The clubs participating in the camp',
    type: () => [Club],
  })
  @ManyToMany(() => Club, (club) => club.camps)
  @JoinTable()
  clubs: Club[];

  @ApiProperty({ description: 'The events of the camp', type: () => [Event] })
  @OneToMany(() => Event, (event) => event.camp)
  events: Event[];
}
