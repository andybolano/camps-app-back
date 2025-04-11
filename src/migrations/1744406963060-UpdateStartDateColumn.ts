import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateStartDateColumn1744406963060 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Primero, actualizar los registros existentes que tengan startDate nulo
    await queryRunner.query(`
            UPDATE "event" 
            SET "startDate" = CURRENT_TIMESTAMP 
            WHERE "startDate" IS NULL
        `);

    // Luego, modificar la columna para que no permita valores nulos y tenga un valor por defecto
    await queryRunner.query(`
            ALTER TABLE "event" 
            ALTER COLUMN "startDate" SET NOT NULL,
            ALTER COLUMN "startDate" SET DEFAULT CURRENT_TIMESTAMP
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "event" 
            ALTER COLUMN "startDate" DROP DEFAULT,
            ALTER COLUMN "startDate" DROP NOT NULL
        `);
  }
}
