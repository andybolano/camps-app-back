import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubsService } from './clubs.service';
import { ClubsController } from './clubs.controller';
import { Club } from './entities/club.entity';
import { Member } from './entities/member.entity';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { CampsModule } from '../camps/camps.module';
import { CommonModule } from '../common/common.module';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Club, Member, User]),
    CampsModule,
    CommonModule,
  ],
  controllers: [ClubsController, MembersController],
  providers: [ClubsService, MembersService],
  exports: [ClubsService, MembersService],
})
export class ClubsModule {}
