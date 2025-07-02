import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

// Load environment variables
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    bufferLogs: true,
  });

  // Configure security headers using Helmet
  app.use(helmet());

  // Configure CORS - more restrictive in production
  if (process.env.NODE_ENV === 'production') {
    // Strict CORS for production
    app.enableCors({
      origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : false,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
      maxAge: 86400, // 24 hours
    });
  } else {
    // More permissive for development
    app.enableCors();
  }

  // Configure global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not in DTO
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
      transform: true, // Transform payloads to DTOs
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Set trusted proxy if behind a reverse proxy like Nginx
  app.set('trust proxy', 1);

  // Configure Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Campamento App API')
    .setDescription(
      'API para la gestión de eventos y resultados de campamentos',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Endpoints relacionados con autenticación y autorización')
    .addTag('users', 'Endpoints para la gestión de usuarios')
    .addTag('events', 'Endpoints para la gestión de eventos')
    .addTag('clubs', 'Endpoints para la gestión de clubes')
    .addTag('camps', 'Endpoints para la gestión de campamentos')
    .addTag('results', 'Endpoints para la gestión de resultados')
    .addTag('health', 'Endpoints para verificar el estado del sistema')
    .addTag('associations', 'Endpoints para la gestión de asociaciones')
    .build();

  // Only enable Swagger in non-production environments for security
  if (
    process.env.NODE_ENV !== 'production' ||
    process.env.ENABLE_SWAGGER === 'true'
  ) {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  // Set global request timeout to prevent hanging requests
  app.use((req, res, next) => {
    res.setTimeout(30000, () => {
      res.status(408).end('Request Timeout');
    });
    next();
  });

  // Start server with graceful shutdown
  const server = await app.listen(process.env.PORT || 3000);

  // Setup graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    await app.close();
    process.exit(0);
  });

  console.log(
    `Server running on ${await app.getUrl()} in ${process.env.NODE_ENV || 'development'} mode`,
  );
}
bootstrap();
