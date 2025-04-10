import { Module } from '@nestjs/common';
import { FilesService } from './services/files.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: process.env.UPLOADS_PATH || join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
        fallthrough: true,
        maxAge: 31536000, // 1 año en segundos
      },
    }),
  ],
  providers: [FilesService],
  exports: [FilesService],
})
export class CommonModule {}
