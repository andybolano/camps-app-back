import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { CommonModule } from './common/common.module';
import { CampsModule } from './camps/camps.module';
import { ClubsModule } from './clubs/clubs.module';
import { EventsModule } from './events/events.module';
import { ResultsModule } from './results/results.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { CampRegistrationsModule } from './camp-registrations/camp-registrations.module';
import { CampEventsModule } from './camp-events/camp-events.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    DatabaseModule,
    CommonModule,
    CampsModule,
    ClubsModule,
    CampRegistrationsModule,
    CategoriesModule,
    EventsModule,
    CampEventsModule,
    ResultsModule,
    UsersModule,
    AuthModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
