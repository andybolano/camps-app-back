import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeEventItemTemplateIdNullableInItems1761271422742
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Hacer eventItemTemplateId nullable en camp_event_item
    await queryRunner.query(`
      ALTER TABLE "camp_event_item"
      ALTER COLUMN "eventItemTemplateId" DROP NOT NULL;
    `);

    // Hacer memberBasedEventItemTemplateId nullable en camp_event_member_based_item
    await queryRunner.query(`
      ALTER TABLE "camp_event_member_based_item"
      ALTER COLUMN "memberBasedEventItemTemplateId" DROP NOT NULL;
    `);

    console.log(
      '✅ Migration completed: eventItemTemplateId and memberBasedEventItemTemplateId are now nullable',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir: hacer las columnas NOT NULL nuevamente
    await queryRunner.query(`
      ALTER TABLE "camp_event_item"
      ALTER COLUMN "eventItemTemplateId" SET NOT NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE "camp_event_member_based_item"
      ALTER COLUMN "memberBasedEventItemTemplateId" SET NOT NULL;
    `);

    console.log(
      '⚠️ Migration reverted: eventItemTemplateId and memberBasedEventItemTemplateId are NOT NULL again',
    );
  }
}
