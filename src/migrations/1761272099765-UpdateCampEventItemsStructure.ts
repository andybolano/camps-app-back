import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCampEventItemsStructure1761272099765
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Eliminar customMaxScore de camp_event_item
    await queryRunner.query(`
      ALTER TABLE "camp_event_item"
      DROP COLUMN IF EXISTS "customMaxScore";
    `);

    // Eliminar customMaxScore de camp_event_member_based_item
    await queryRunner.query(`
      ALTER TABLE "camp_event_member_based_item"
      DROP COLUMN IF EXISTS "customMaxScore";
    `);

    // Agregar nuevas columnas a camp_event_member_based_item
    await queryRunner.query(`
      ALTER TABLE "camp_event_member_based_item"
      ADD COLUMN IF NOT EXISTS "applicableCharacteristics" text,
      ADD COLUMN IF NOT EXISTS "calculationType" varchar,
      ADD COLUMN IF NOT EXISTS "isRequired" boolean NOT NULL DEFAULT false;
    `);

    console.log(
      '✅ Migration completed: Estructura de items actualizada',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir: agregar customMaxScore de nuevo
    await queryRunner.query(`
      ALTER TABLE "camp_event_item"
      ADD COLUMN "customMaxScore" integer;
    `);

    await queryRunner.query(`
      ALTER TABLE "camp_event_member_based_item"
      ADD COLUMN "customMaxScore" integer;
    `);

    // Eliminar nuevas columnas
    await queryRunner.query(`
      ALTER TABLE "camp_event_member_based_item"
      DROP COLUMN IF EXISTS "applicableCharacteristics",
      DROP COLUMN IF EXISTS "calculationType",
      DROP COLUMN IF EXISTS "isRequired";
    `);

    console.log('⚠️ Migration reverted: Estructura anterior restaurada');
  }
}
