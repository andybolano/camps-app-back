import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Load environment variables
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configurar CORS
  app.enableCors();

  // Configurar Swagger
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
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Configurar archivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
