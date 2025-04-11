import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');

  // Enable CORS with specific origin in development mode
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    app.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
  } else {
    app.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
  }

  // Only serve static assets in production mode
  if (!isDev) {
    app.useStaticAssets(
      join(__dirname, '..', '..', 'frontend/dist/frontend/browser'),
    );

    // Wildcard middleware para rutas no-API (solo en producción)
    app.use('*', (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        next();
      } else {
        res.sendFile(
          join(
            __dirname,
            '..',
            '..',
            'frontend/dist/frontend/browser/index.html',
          ),
        );
      }
    });
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application running on: ${await app.getUrl()}`);
  console.log(`Environment: ${isDev ? 'development' : 'production'}`);
}
bootstrap();
