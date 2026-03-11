import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeEventTemplateIdNullableInCampEvent1761257624057
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Hacer la columna eventTemplateId nullable para permitir eventos sin plantilla
    await queryRunner.query(`
      ALTER TABLE "camp_event"
      ALTER COLUMN "eventTemplateId" DROP NOT NULL;
    `);

    console.log(
      '✅ Migration completed: eventTemplateId is now nullable in camp_event',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir: hacer la columna NOT NULL nuevamente
    // NOTA: Esto fallará si hay registros con eventTemplateId NULL
    await queryRunner.query(`
      ALTER TABLE "camp_event"
      ALTER COLUMN "eventTemplateId" SET NOT NULL;
    `);

    console.log('⚠️ Migration reverted: eventTemplateId is now NOT NULL again');
  }
}
