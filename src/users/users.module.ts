import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { Club } from '../clubs/entities/club.entity';
import { Association } from '../associations/entities/association.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Club, Association])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
