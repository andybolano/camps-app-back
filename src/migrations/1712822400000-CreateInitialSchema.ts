import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema1712822400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create user table first
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" SERIAL PRIMARY KEY,
        "username" varchar NOT NULL UNIQUE,
        "password" varchar NOT NULL,
        "role" varchar NOT NULL DEFAULT 'user'
      )
    `);

    // Create event table
    await queryRunner.query(`
      CREATE TABLE "event" (
        "id" SERIAL PRIMARY KEY,
        "name" varchar NOT NULL,
        "description" text,
        "startDate" timestamp NOT NULL,
        "endDate" timestamp NOT NULL,
        "campId" integer
      )
    `);

    // Create event_item table with foreign key to event
    await queryRunner.query(`
      CREATE TABLE "event_item" (
        "id" SERIAL PRIMARY KEY,
        "name" varchar NOT NULL,
        "eventId" integer,
        CONSTRAINT "FK_event_item_event" FOREIGN KEY ("eventId") REFERENCES "event" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
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
        CONSTRAINT "FK_member_based_event_item_event" FOREIGN KEY ("eventId") REFERENCES "event" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_event_item_eventId" ON "event_item" ("eventId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_member_based_event_item_eventId" ON "member_based_event_item" ("eventId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE "member_based_event_item"`);
    await queryRunner.query(`DROP TABLE "event_item"`);
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
