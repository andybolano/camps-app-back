import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorClubArchitecture1760382303738
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop all existing data and foreign keys
    await queryRunner.query(`
      -- Drop existing foreign keys and tables that will be replaced
      DROP TABLE IF EXISTS "result_member_based_item" CASCADE;
      DROP TABLE IF EXISTS "result_item" CASCADE;
      DROP TABLE IF EXISTS "result" CASCADE;
      DROP TABLE IF EXISTS "member_characteristic" CASCADE;
      DROP TABLE IF EXISTS "club" CASCADE;
    `);

    // 2. Create Category table
    await queryRunner.query(`
      CREATE TABLE "category" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL UNIQUE,
        "description" VARCHAR NOT NULL,
        "code" VARCHAR NOT NULL UNIQUE,
        "isActive" BOOLEAN NOT NULL DEFAULT true
      );
    `);

    // 3. Create Club table (simplified)
    await queryRunner.query(`
      CREATE TABLE "club" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "city" VARCHAR NOT NULL,
        "motto" VARCHAR,
        "shieldUrl" VARCHAR,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // 4. Create ClubCategory join table
    await queryRunner.query(`
      CREATE TABLE "club_category" (
        "id" SERIAL PRIMARY KEY,
        "clubId" INTEGER NOT NULL,
        "categoryId" INTEGER NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_club_category_club" FOREIGN KEY ("clubId")
          REFERENCES "club"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_club_category_category" FOREIGN KEY ("categoryId")
          REFERENCES "category"("id") ON DELETE RESTRICT,
        CONSTRAINT "UQ_club_category" UNIQUE ("clubId", "categoryId")
      );
    `);

    // 5. Create CampRegistration table
    await queryRunner.query(`
      CREATE TABLE "camp_registration" (
        "id" SERIAL PRIMARY KEY,
        "campId" INTEGER NOT NULL,
        "clubCategoryId" INTEGER NOT NULL,
        "participantsCount" INTEGER NOT NULL DEFAULT 0,
        "guestsCount" INTEGER NOT NULL DEFAULT 0,
        "minorsCount" INTEGER NOT NULL DEFAULT 0,
        "economsCount" INTEGER NOT NULL DEFAULT 0,
        "companionsCount" INTEGER NOT NULL DEFAULT 0,
        "directorCount" INTEGER NOT NULL DEFAULT 0,
        "pastorCount" INTEGER NOT NULL DEFAULT 0,
        "registrationFee" FLOAT NOT NULL,
        "isPaid" BOOLEAN NOT NULL DEFAULT false,
        "registrationDate" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_camp_registration_camp" FOREIGN KEY ("campId")
          REFERENCES "camp"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_camp_registration_club_category" FOREIGN KEY ("clubCategoryId")
          REFERENCES "club_category"("id") ON DELETE RESTRICT
      );
    `);

    // 6. Update Camp table to add targetCategoryId
    await queryRunner.query(`
      ALTER TABLE "camp"
      ADD COLUMN "targetCategoryId" INTEGER,
      ADD CONSTRAINT "FK_camp_target_category" FOREIGN KEY ("targetCategoryId")
        REFERENCES "category"("id") ON DELETE SET NULL;
    `);

    // 7. Recreate Result table with new relationship
    await queryRunner.query(`
      CREATE TABLE "result" (
        "id" SERIAL PRIMARY KEY,
        "totalScore" FLOAT NOT NULL DEFAULT 0,
        "campRegistrationId" INTEGER NOT NULL,
        "eventId" INTEGER NOT NULL,
        CONSTRAINT "FK_result_camp_registration" FOREIGN KEY ("campRegistrationId")
          REFERENCES "camp_registration"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_result_event" FOREIGN KEY ("eventId")
          REFERENCES "event"("id") ON DELETE CASCADE
      );
    `);

    // 8. Recreate result items tables
    await queryRunner.query(`
      CREATE TABLE "result_item" (
        "id" SERIAL PRIMARY KEY,
        "score" FLOAT NOT NULL DEFAULT 0,
        "resultId" INTEGER NOT NULL,
        "eventItemId" INTEGER NOT NULL,
        CONSTRAINT "FK_result_item_result" FOREIGN KEY ("resultId")
          REFERENCES "result"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_result_item_event_item" FOREIGN KEY ("eventItemId")
          REFERENCES "event_item"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "result_member_based_item" (
        "id" SERIAL PRIMARY KEY,
        "score" FLOAT NOT NULL DEFAULT 0,
        "resultId" INTEGER NOT NULL,
        "memberBasedEventItemId" INTEGER NOT NULL,
        CONSTRAINT "FK_result_member_based_item_result" FOREIGN KEY ("resultId")
          REFERENCES "result"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_result_member_based_item_event_item" FOREIGN KEY ("memberBasedEventItemId")
          REFERENCES "member_based_event_item"("id") ON DELETE CASCADE
      );
    `);

    // 9. Insert initial categories
    await queryRunner.query(`
      INSERT INTO "category" ("name", "description", "code") VALUES
      ('Guías Mayores', 'Categoría para jóvenes de 16 años en adelante', 'GM'),
      ('Conquistadores', 'Categoría para niños y adolescentes de 10 a 15 años', 'CQ'),
      ('Aventureros', 'Categoría para niños de 6 a 9 años', 'AV');
    `);

    console.log('✅ Migration completed: New club architecture implemented');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // This migration is destructive, rollback would require data backup
    console.log(
      '⚠️  This is a destructive migration. Rollback not fully supported.',
    );

    // Drop new tables
    await queryRunner.query(`DROP TABLE IF EXISTS "result_member_based_item" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "result_item" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "result" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "camp_registration" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "club_category" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "club" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "category" CASCADE`);

    // Remove added column from camp
    await queryRunner.query(`
      ALTER TABLE "camp"
      DROP CONSTRAINT IF EXISTS "FK_camp_target_category",
      DROP COLUMN IF EXISTS "targetCategoryId";
    `);
  }
}
