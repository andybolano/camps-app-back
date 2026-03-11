import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCascadeDeleteToEventItems1761273003034
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Eliminar constraint existente de event_item
    await queryRunner.query(`
      DO $$
      DECLARE
        constraint_name text;
      BEGIN
        SELECT tc.constraint_name INTO constraint_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'event_item'
        AND tc.constraint_type = 'FOREIGN KEY'
        AND kcu.column_name = 'eventId';

        IF constraint_name IS NOT NULL THEN
          EXECUTE format('ALTER TABLE "event_item" DROP CONSTRAINT %I', constraint_name);
        END IF;
      END $$;
    `);

    // Recrear constraint con ON DELETE CASCADE
    await queryRunner.query(`
      ALTER TABLE "event_item"
      ADD CONSTRAINT "FK_event_item_event"
      FOREIGN KEY ("eventId")
      REFERENCES "event"("id")
      ON DELETE CASCADE;
    `);

    // Eliminar constraint existente de member_based_event_item
    await queryRunner.query(`
      DO $$
      DECLARE
        constraint_name text;
      BEGIN
        SELECT tc.constraint_name INTO constraint_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'member_based_event_item'
        AND tc.constraint_type = 'FOREIGN KEY'
        AND kcu.column_name = 'eventId';

        IF constraint_name IS NOT NULL THEN
          EXECUTE format('ALTER TABLE "member_based_event_item" DROP CONSTRAINT %I', constraint_name);
        END IF;
      END $$;
    `);

    // Recrear constraint con ON DELETE CASCADE
    await queryRunner.query(`
      ALTER TABLE "member_based_event_item"
      ADD CONSTRAINT "FK_member_based_event_item_event"
      FOREIGN KEY ("eventId")
      REFERENCES "event"("id")
      ON DELETE CASCADE;
    `);

    console.log(
      '✅ Migration completed: ON DELETE CASCADE agregado a event_item y member_based_event_item',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir: eliminar constraints con ON DELETE CASCADE
    await queryRunner.query(`
      ALTER TABLE "event_item"
      DROP CONSTRAINT IF EXISTS "FK_event_item_event";
    `);

    await queryRunner.query(`
      ALTER TABLE "member_based_event_item"
      DROP CONSTRAINT IF EXISTS "FK_member_based_event_item_event";
    `);

    // Recrear constraints sin ON DELETE CASCADE
    await queryRunner.query(`
      ALTER TABLE "event_item"
      ADD CONSTRAINT "FK_event_item_event"
      FOREIGN KEY ("eventId")
      REFERENCES "event"("id");
    `);

    await queryRunner.query(`
      ALTER TABLE "member_based_event_item"
      ADD CONSTRAINT "FK_member_based_event_item_event"
      FOREIGN KEY ("eventId")
      REFERENCES "event"("id");
    `);

    console.log('⚠️ Migration reverted: ON DELETE CASCADE removido');
  }
}
