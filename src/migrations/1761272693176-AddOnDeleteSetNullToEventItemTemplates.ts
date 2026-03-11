import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOnDeleteSetNullToEventItemTemplates1761272693176
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Primero necesitamos obtener el nombre de las constraints existentes
    // Eliminar constraint existente de camp_event_item
    await queryRunner.query(`
      DO $$
      DECLARE
        constraint_name text;
      BEGIN
        SELECT tc.constraint_name INTO constraint_name
        FROM information_schema.table_constraints tc
        WHERE tc.table_name = 'camp_event_item'
        AND tc.constraint_type = 'FOREIGN KEY'
        AND tc.constraint_name LIKE '%eventItemTemplateId%';

        IF constraint_name IS NOT NULL THEN
          EXECUTE format('ALTER TABLE "camp_event_item" DROP CONSTRAINT %I', constraint_name);
        END IF;
      END $$;
    `);

    // Recrear constraint con ON DELETE SET NULL
    await queryRunner.query(`
      ALTER TABLE "camp_event_item"
      ADD CONSTRAINT "FK_camp_event_item_eventItemTemplate"
      FOREIGN KEY ("eventItemTemplateId")
      REFERENCES "event_item"("id")
      ON DELETE SET NULL;
    `);

    // Eliminar constraint existente de camp_event_member_based_item
    await queryRunner.query(`
      DO $$
      DECLARE
        constraint_name text;
      BEGIN
        SELECT tc.constraint_name INTO constraint_name
        FROM information_schema.table_constraints tc
        WHERE tc.table_name = 'camp_event_member_based_item'
        AND tc.constraint_type = 'FOREIGN KEY'
        AND tc.constraint_name LIKE '%memberBasedEventItemTemplateId%';

        IF constraint_name IS NOT NULL THEN
          EXECUTE format('ALTER TABLE "camp_event_member_based_item" DROP CONSTRAINT %I', constraint_name);
        END IF;
      END $$;
    `);

    // Recrear constraint con ON DELETE SET NULL
    await queryRunner.query(`
      ALTER TABLE "camp_event_member_based_item"
      ADD CONSTRAINT "FK_camp_event_member_based_item_eventItemTemplate"
      FOREIGN KEY ("memberBasedEventItemTemplateId")
      REFERENCES "member_based_event_item"("id")
      ON DELETE SET NULL;
    `);

    console.log(
      '✅ Migration completed: ON DELETE SET NULL agregado a las claves foráneas de templates',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir: eliminar constraints con ON DELETE SET NULL
    await queryRunner.query(`
      ALTER TABLE "camp_event_item"
      DROP CONSTRAINT IF EXISTS "FK_camp_event_item_eventItemTemplate";
    `);

    await queryRunner.query(`
      ALTER TABLE "camp_event_member_based_item"
      DROP CONSTRAINT IF EXISTS "FK_camp_event_member_based_item_eventItemTemplate";
    `);

    // Recrear constraints sin ON DELETE
    await queryRunner.query(`
      ALTER TABLE "camp_event_item"
      ADD CONSTRAINT "FK_camp_event_item_eventItemTemplate"
      FOREIGN KEY ("eventItemTemplateId")
      REFERENCES "event_item"("id");
    `);

    await queryRunner.query(`
      ALTER TABLE "camp_event_member_based_item"
      ADD CONSTRAINT "FK_camp_event_member_based_item_eventItemTemplate"
      FOREIGN KEY ("memberBasedEventItemTemplateId")
      REFERENCES "member_based_event_item"("id");
    `);

    console.log('⚠️ Migration reverted: ON DELETE SET NULL removido');
  }
}
