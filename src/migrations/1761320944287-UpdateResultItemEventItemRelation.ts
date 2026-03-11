import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateResultItemEventItemRelation1761320944287 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop existing foreign key constraint from result_item to event_item
        await queryRunner.query(`
            DO $$
            DECLARE
                constraint_name text;
            BEGIN
                SELECT tc.constraint_name INTO constraint_name
                FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage kcu
                    ON tc.constraint_name = kcu.constraint_name
                WHERE tc.table_name = 'result_item'
                AND tc.constraint_type = 'FOREIGN KEY'
                AND kcu.column_name = 'eventItemId';

                IF constraint_name IS NOT NULL THEN
                    EXECUTE format('ALTER TABLE "result_item" DROP CONSTRAINT %I', constraint_name);
                END IF;
            END $$;
        `);

        // Add new foreign key constraint to camp_event_item
        await queryRunner.query(`
            ALTER TABLE "result_item"
            ADD CONSTRAINT "FK_result_item_camp_event_item"
            FOREIGN KEY ("eventItemId")
            REFERENCES "camp_event_item"("id")
            ON DELETE CASCADE;
        `);

        console.log('✅ Migration completed: result_item now references camp_event_item');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop constraint to camp_event_item
        await queryRunner.query(`
            ALTER TABLE "result_item"
            DROP CONSTRAINT IF EXISTS "FK_result_item_camp_event_item";
        `);

        // Restore constraint to event_item
        await queryRunner.query(`
            ALTER TABLE "result_item"
            ADD CONSTRAINT "FK_result_item_event_item"
            FOREIGN KEY ("eventItemId")
            REFERENCES "event_item"("id")
            ON DELETE CASCADE;
        `);

        console.log('⚠️ Migration reverted: result_item now references event_item');
    }

}
