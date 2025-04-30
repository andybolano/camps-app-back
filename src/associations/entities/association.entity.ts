import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Association {
  @ApiProperty({
    description: 'The unique identifier of the association',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The name of the association',
    example: 'Asociación Deportiva Nacional',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'The country where the association is based',
    example: 'Spain',
  })
  @Column()
  country: string;

  @OneToMany(() => User, (user) => user.association)
  users: User[];
}
