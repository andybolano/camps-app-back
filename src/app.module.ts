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

@Module({
  imports: [
    DatabaseModule,
    CommonModule,
    CampsModule,
    ClubsModule,
    EventsModule,
    ResultsModule,
    UsersModule,
    AuthModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
