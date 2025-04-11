import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema1712822400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS "result_member_based_item"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "result_item"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "result"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "member_based_event_item"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "event_item"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "event"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "member_characteristic"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "club"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "camp"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user"`);

    // Create user table first
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" SERIAL PRIMARY KEY,
        "username" varchar NOT NULL UNIQUE,
        "password" varchar NOT NULL,
        "role" varchar NOT NULL DEFAULT 'user'
      )
    `);

    // Create camp table
    await queryRunner.query(`
      CREATE TABLE "camp" (
        "id" SERIAL PRIMARY KEY,
        "name" varchar NOT NULL,
        "location" varchar NOT NULL,
        "startDate" timestamp NOT NULL,
        "endDate" timestamp NOT NULL,
        "description" text,
        "logoUrl" varchar
      )
    `);

    // Create club table with foreign key to camp
    await queryRunner.query(`
      CREATE TABLE "club" (
        "id" SERIAL PRIMARY KEY,
        "name" varchar NOT NULL,
        "city" varchar NOT NULL,
        "participantsCount" integer NOT NULL,
        "guestsCount" integer NOT NULL,
        "minorsCount" integer NOT NULL DEFAULT 0,
        "economsCount" integer NOT NULL,
        "companionsCount" integer NOT NULL DEFAULT 0,
        "registrationFee" float NOT NULL,
        "isPaid" boolean NOT NULL DEFAULT true,
        "shieldUrl" varchar,
        "campId" integer,
        CONSTRAINT "FK_club_camp" FOREIGN KEY ("campId") REFERENCES "camp" ("id") ON DELETE CASCADE
      )
    `);

    // Create member_characteristic table with foreign key to club
    await queryRunner.query(`
      CREATE TABLE "member_characteristic" (
        "id" SERIAL PRIMARY KEY,
        "name" varchar NOT NULL,
        "value" integer NOT NULL,
        "matchCount" integer NOT NULL DEFAULT 0,
        "clubId" integer,
        CONSTRAINT "FK_member_characteristic_club" FOREIGN KEY ("clubId") REFERENCES "club" ("id") ON DELETE CASCADE
      )
    `);

    // Create event table with foreign key to camp
    await queryRunner.query(`
      CREATE TABLE "event" (
        "id" SERIAL PRIMARY KEY,
        "name" varchar NOT NULL,
        "description" text,
        "type" varchar NOT NULL DEFAULT 'REGULAR',
        "startDate" timestamp NOT NULL,
        "endDate" timestamp NOT NULL,
        "campId" integer,
        CONSTRAINT "FK_event_camp" FOREIGN KEY ("campId") REFERENCES "camp" ("id") ON DELETE CASCADE
      )
    `);

    // Create event_item table with foreign key to event
    await queryRunner.query(`
      CREATE TABLE "event_item" (
        "id" SERIAL PRIMARY KEY,
        "name" varchar NOT NULL,
        "eventId" integer,
        CONSTRAINT "FK_event_item_event" FOREIGN KEY ("eventId") REFERENCES "event" ("id") ON DELETE CASCADE
      )
    `);

    // Create member_based_event_item table with foreign key to event
    await queryRunner.query(`
      CREATE TABLE "member_based_event_item" (
        "id" SERIAL PRIMARY KEY,
        "name" varchar NOT NULL,
        "applicableCharacteristics" text NOT NULL,
        "calculationType" varchar NOT NULL DEFAULT 'PROPORTION',
        "isRequired" boolean NOT NULL DEFAULT false,
        "eventId" integer,
        CONSTRAINT "FK_member_based_event_item_event" FOREIGN KEY ("eventId") REFERENCES "event" ("id") ON DELETE CASCADE
      )
    `);

    // Create result table with foreign keys to club and event
    await queryRunner.query(`
      CREATE TABLE "result" (
        "id" SERIAL PRIMARY KEY,
        "totalScore" float NOT NULL DEFAULT 0,
        "clubId" integer,
        "eventId" integer,
        CONSTRAINT "FK_result_club" FOREIGN KEY ("clubId") REFERENCES "club" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_result_event" FOREIGN KEY ("eventId") REFERENCES "event" ("id") ON DELETE CASCADE
      )
    `);

    // Create result_item table with foreign keys to result and event_item
    await queryRunner.query(`
      CREATE TABLE "result_item" (
        "id" SERIAL PRIMARY KEY,
        "score" float NOT NULL,
        "resultId" integer,
        "eventItemId" integer,
        CONSTRAINT "FK_result_item_result" FOREIGN KEY ("resultId") REFERENCES "result" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_result_item_event_item" FOREIGN KEY ("eventItemId") REFERENCES "event_item" ("id") ON DELETE CASCADE
      )
    `);

    // Create result_member_based_item table with foreign keys to result and member_based_event_item
    await queryRunner.query(`
      CREATE TABLE "result_member_based_item" (
        "id" SERIAL PRIMARY KEY,
        "score" float NOT NULL,
        "totalWithCharacteristic" integer NOT NULL DEFAULT 0,
        "matchCount" integer NOT NULL DEFAULT 0,
        "resultId" integer,
        "eventItemId" integer,
        CONSTRAINT "FK_result_member_based_item_result" FOREIGN KEY ("resultId") REFERENCES "result" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_result_member_based_item_event_item" FOREIGN KEY ("eventItemId") REFERENCES "member_based_event_item" ("id") ON DELETE CASCADE
      )
    `);

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_club_campId" ON "club" ("campId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_member_characteristic_clubId" ON "member_characteristic" ("clubId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_event_campId" ON "event" ("campId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_event_item_eventId" ON "event_item" ("eventId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_member_based_event_item_eventId" ON "member_based_event_item" ("eventId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_result_clubId" ON "result" ("clubId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_result_eventId" ON "result" ("eventId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_result_item_resultId" ON "result_item" ("resultId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_result_item_eventItemId" ON "result_item" ("eventItemId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_result_member_based_item_resultId" ON "result_member_based_item" ("resultId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_result_member_based_item_eventItemId" ON "result_member_based_item" ("eventItemId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS "result_member_based_item"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "result_item"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "result"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "member_based_event_item"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "event_item"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "event"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "member_characteristic"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "club"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "camp"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
  }
}
