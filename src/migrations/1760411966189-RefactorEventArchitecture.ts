import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorEventArchitecture1760411966189 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Drop existing result tables (they reference event directly)
        await queryRunner.query(`DROP TABLE IF EXISTS "result_member_based_item" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "result_item" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "result" CASCADE`);

        // 2. Remove campId from event table (events are now independent)
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT IF EXISTS "FK_event_camp"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN IF EXISTS "campId"`);

        // 3. Add categoryId to event table and timestamps
        await queryRunner.query(`
            ALTER TABLE "event"
            ADD COLUMN "categoryId" integer,
            ADD COLUMN "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            ADD COLUMN "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "event"
            ADD CONSTRAINT "FK_event_category"
            FOREIGN KEY ("categoryId") REFERENCES "category"("id")
            ON DELETE SET NULL
        `);

        // 4. Create camp_event table (event instances in camps)
        await queryRunner.query(`
            CREATE TABLE "camp_event" (
                "id" SERIAL PRIMARY KEY,
                "campId" integer NOT NULL,
                "eventTemplateId" integer NOT NULL,
                "customName" varchar,
                "customDescription" varchar,
                "customMaxScore" integer,
                "isActive" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_camp_event_camp" FOREIGN KEY ("campId") REFERENCES "camp"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_camp_event_event_template" FOREIGN KEY ("eventTemplateId") REFERENCES "event"("id") ON DELETE CASCADE
            )
        `);

        // 5. Create camp_event_item table
        await queryRunner.query(`
            CREATE TABLE "camp_event_item" (
                "id" SERIAL PRIMARY KEY,
                "campEventId" integer NOT NULL,
                "eventItemTemplateId" integer NOT NULL,
                "customName" varchar,
                "customMaxScore" integer,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_camp_event_item_camp_event" FOREIGN KEY ("campEventId") REFERENCES "camp_event"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_camp_event_item_event_item_template" FOREIGN KEY ("eventItemTemplateId") REFERENCES "event_item"("id") ON DELETE CASCADE
            )
        `);

        // 6. Create camp_event_member_based_item table
        await queryRunner.query(`
            CREATE TABLE "camp_event_member_based_item" (
                "id" SERIAL PRIMARY KEY,
                "campEventId" integer NOT NULL,
                "memberBasedEventItemTemplateId" integer NOT NULL,
                "customName" varchar,
                "customMaxScore" integer,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_camp_event_member_based_item_camp_event" FOREIGN KEY ("campEventId") REFERENCES "camp_event"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_camp_event_member_based_item_template" FOREIGN KEY ("memberBasedEventItemTemplateId") REFERENCES "member_based_event_item"("id") ON DELETE CASCADE
            )
        `);

        // 7. Recreate result table with campEventId reference
        await queryRunner.query(`
            CREATE TABLE "result" (
                "id" SERIAL PRIMARY KEY,
                "campRegistrationId" integer NOT NULL,
                "campEventId" integer NOT NULL,
                "totalScore" integer NOT NULL DEFAULT 0,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_result_camp_registration" FOREIGN KEY ("campRegistrationId") REFERENCES "camp_registration"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_result_camp_event" FOREIGN KEY ("campEventId") REFERENCES "camp_event"("id") ON DELETE CASCADE,
                CONSTRAINT "UQ_result_camp_registration_camp_event" UNIQUE ("campRegistrationId", "campEventId")
            )
        `);

        // 8. Recreate result_item table
        await queryRunner.query(`
            CREATE TABLE "result_item" (
                "id" SERIAL PRIMARY KEY,
                "resultId" integer NOT NULL,
                "eventItemId" integer NOT NULL,
                "score" integer NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_result_item_result" FOREIGN KEY ("resultId") REFERENCES "result"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_result_item_event_item" FOREIGN KEY ("eventItemId") REFERENCES "event_item"("id") ON DELETE CASCADE
            )
        `);

        // 9. Recreate result_member_based_item table
        await queryRunner.query(`
            CREATE TABLE "result_member_based_item" (
                "id" SERIAL PRIMARY KEY,
                "resultId" integer NOT NULL,
                "memberBasedEventItemId" integer NOT NULL,
                "score" integer NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_result_member_based_item_result" FOREIGN KEY ("resultId") REFERENCES "result"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_result_member_based_item_member_based_event_item" FOREIGN KEY ("memberBasedEventItemId") REFERENCES "member_based_event_item"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverse the migration
        await queryRunner.query(`DROP TABLE IF EXISTS "result_member_based_item" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "result_item" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "result" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "camp_event_member_based_item" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "camp_event_item" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "camp_event" CASCADE`);

        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT IF EXISTS "FK_event_category"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN IF EXISTS "categoryId"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN IF EXISTS "createdAt"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN IF EXISTS "updatedAt"`);

        // Note: Not recreating old structure as data would be lost anyway
    }

}
