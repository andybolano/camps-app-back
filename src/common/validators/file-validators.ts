import { FileValidator } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

export class MaxFileSizeValidator extends FileValidator {
  constructor(protected readonly maxSize: number) {
    super({});
  }

  isValid(file?: Express.Multer.File): boolean {
    return file.size <= this.maxSize;
  }

  buildErrorMessage(file: Express.Multer.File): string {
    return `File ${file.originalname} is too large. Maximum size is ${this.maxSize / (1024 * 1024)}MB`;
  }
}

export class FileTypeValidator extends FileValidator {
  constructor(protected readonly allowedTypes: string[]) {
    super({});
  }

  isValid(file?: Express.Multer.File): boolean {
    return this.allowedTypes.includes(file.mimetype);
  }

  buildErrorMessage(file: Express.Multer.File): string {
    return `File type ${file.mimetype} is not allowed. Allowed types: ${this.allowedTypes.join(', ')}`;
  }
}

export function validateImage(file: Express.Multer.File) {
  // Check if file exists
  if (!file) {
    throw new BadRequestException('No file uploaded');
  }

  // Allowed image types
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  
  // Maximum file size (5MB)
  const maxSize = 5 * 1024 * 1024;

  // Validate file type
  if (!allowedTypes.includes(file.mimetype)) {
    throw new BadRequestException(
      `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    );
  }

  // Validate file size
  if (file.size > maxSize) {
    throw new BadRequestException(
      `File size exceeds maximum limit of ${maxSize / (1024 * 1024)}MB`,
    );
  }

  return true;
}