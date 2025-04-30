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
import { AssociationsModule } from './associations/associations.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    // Rate limiting configuration
    ThrottlerModule.forRoot([{
      ttl: 60000, // time to live: 1 minute
      limit: 100, // max requests per TTL
    }]),
    DatabaseModule,
    CommonModule,
    CampsModule,
    ClubsModule,
    EventsModule,
    ResultsModule,
    UsersModule,
    AuthModule,
    HealthModule,
    AssociationsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        maxAge: 31536000, // 1 year in milliseconds
        fallthrough: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global exception filter for standardized error responses
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // Global rate limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
