import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampRegistrationsService } from './camp-registrations.service';
import { CampRegistrationsController } from './camp-registrations.controller';
import { CampRegistration } from './entities/camp-registration.entity';
import { ClubCategory } from '../clubs/entities/club-category.entity';
import { CampsModule } from '../camps/camps.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CampRegistration, ClubCategory]),
    CampsModule,
  ],
  controllers: [CampRegistrationsController],
  providers: [CampRegistrationsService],
  exports: [CampRegistrationsService],
})
export class CampRegistrationsModule {}
