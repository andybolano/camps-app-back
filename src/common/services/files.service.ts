import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { existsSync, promises as fsPromises } from 'fs';
import { join } from 'path';
import * as crypto from 'crypto';
import * as path from 'path';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly uploadsDir = process.env.UPLOADS_PATH || join(process.cwd(), 'uploads');
  // List of allowed file types
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  // Maximum file size in bytes (5MB)
  private readonly maxFileSize = 5 * 1024 * 1024;

  constructor() {
    this.initializeUploadsDir();
  }

  private async initializeUploadsDir(): Promise<void> {
    try {
      if (!existsSync(this.uploadsDir)) {
        await fsPromises.mkdir(this.uploadsDir, { recursive: true });
        this.logger.log(`Uploads directory created: ${this.uploadsDir}`);
      }
    } catch (error) {
      this.logger.error(`Failed to create uploads directory: ${error.message}`);
      throw error;
    }
  }

  async saveFile(file: Express.Multer.File, subFolder: string = ''): Promise<string> {
    try {
      // Validate file type
      if (!this.allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `File type not allowed. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
        );
      }

      // Validate file size
      if (file.size > this.maxFileSize) {
        throw new BadRequestException(
          `File size exceeds maximum limit of ${this.maxFileSize / (1024 * 1024)}MB`,
        );
      }

      // Create the subdirectory if specified
      const targetDir = subFolder ? join(this.uploadsDir, subFolder) : this.uploadsDir;

      if (!existsSync(targetDir)) {
        await fsPromises.mkdir(targetDir, { recursive: true });
      }

      // Generate a secure random filename
      const fileExt = path.extname(file.originalname).toLowerCase();
      const safeOriginalName = this.sanitizeFilename(path.basename(file.originalname, fileExt));
      const randomHash = crypto.randomBytes(16).toString('hex');
      const timestamp = Date.now();
      const fileName = `${safeOriginalName}-${timestamp}-${randomHash}${fileExt}`;

      // Full path to save the file
      const filePath = join(targetDir, fileName);

      // Save the file asynchronously
      await fsPromises.writeFile(filePath, file.buffer);

      // Return the relative path of the file (for database storage)
      const relativePath = subFolder
        ? `uploads/${subFolder}/${fileName}`
        : `uploads/${fileName}`;

      this.logger.log(`File saved: ${relativePath}`);
      return relativePath;
    } catch (error) {
      this.logger.error(`Error saving file: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      if (!filePath) {
        this.logger.warn('No file path provided for deletion');
        return;
      }

      // Convert relative path to absolute path
      const absolutePath = join(process.cwd(), filePath);

      // Check if the file exists and delete it
      if (existsSync(absolutePath)) {
        await fsPromises.unlink(absolutePath);
        this.logger.log(`File deleted: ${filePath}`);
      } else {
        this.logger.warn(`File not found: ${filePath}`);
      }
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`);
      throw error;
    }
  }

  // Sanitize filename to prevent path traversal and other security issues
  private sanitizeFilename(filename: string): string {
    // Remove any directory traversal characters and restrict to alphanumeric, dash, underscore
    return filename
      .replace(/[^\w\d.-]/g, '_') // Replace any non-alphanumeric chars with underscore
      .replace(/\.+/g, '.') // Replace multiple periods with single period
      .replace(/^\./, '_'); // Replace leading period with underscore
  }
}