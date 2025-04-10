import { Injectable, Logger } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly uploadsDir =
    process.env.UPLOADS_PATH || join(process.cwd(), 'uploads');

  constructor() {
    // Crear directorio de uploads si no existe
    if (!existsSync(this.uploadsDir)) {
      mkdirSync(this.uploadsDir, { recursive: true });
      this.logger.log(`Directorio de uploads creado: ${this.uploadsDir}`);
    }
  }

  async saveFile(
    file: Express.Multer.File,
    subFolder: string = '',
  ): Promise<string> {
    try {
      // Crear el subdirectorio si se especifica
      const targetDir = subFolder
        ? join(this.uploadsDir, subFolder)
        : this.uploadsDir;

      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
      }

      // Generar un nombre único para el archivo
      const timestamp = new Date().getTime();
      const fileNameWithoutExt = file.originalname.split('.')[0];
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${fileNameWithoutExt}-${timestamp}.${fileExt}`;

      // Ruta completa del archivo
      const filePath = join(targetDir, fileName);

      // Guardar el archivo
      fs.writeFileSync(filePath, file.buffer);

      // Devolver la ruta relativa del archivo (para almacenar en la base de datos)
      const relativePath = subFolder
        ? `uploads/${subFolder}/${fileName}`
        : `uploads/${fileName}`;

      this.logger.log(`Archivo guardado: ${relativePath}`);
      return relativePath;
    } catch (error) {
      this.logger.error(`Error al guardar archivo: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      // La filePath viene como ruta relativa (ej: uploads/camps/imagen.jpg)
      // Convertir a ruta absoluta
      const absolutePath = join(process.cwd(), filePath);

      if (existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        this.logger.log(`Archivo eliminado: ${filePath}`);
      } else {
        this.logger.warn(`Archivo no encontrado: ${filePath}`);
      }
    } catch (error) {
      this.logger.error(`Error al eliminar archivo: ${error.message}`);
      throw error;
    }
  }
}
