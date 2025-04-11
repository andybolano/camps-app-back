import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveDatesFromEvent1744407043273 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Eliminar las columnas startDate y endDate
    await queryRunner.query(`
            ALTER TABLE "event" 
            DROP COLUMN IF EXISTS "startDate",
            DROP COLUMN IF EXISTS "endDate"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restaurar las columnas si es necesario revertir
    await queryRunner.query(`
            ALTER TABLE "event" 
            ADD COLUMN "startDate" TIMESTAMP,
            ADD COLUMN "endDate" TIMESTAMP
        `);
  }
}
