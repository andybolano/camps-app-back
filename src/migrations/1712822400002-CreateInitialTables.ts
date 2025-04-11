import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1712822400002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla de usuarios
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" SERIAL PRIMARY KEY,
        "username" varchar NOT NULL UNIQUE,
        "password" varchar NOT NULL,
        "role" varchar NOT NULL DEFAULT 'user'
      )
    `);

    // Crear tabla de eventos
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

    // Crear tabla de items de evento
    await queryRunner.query(`
      CREATE TABLE "event_item" (
        "id" SERIAL PRIMARY KEY,
        "name" varchar NOT NULL,
        "eventId" integer,
        CONSTRAINT "FK_event_item_event" FOREIGN KEY ("eventId") REFERENCES "event" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Crear tabla de items de evento basados en miembros
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

    // Crear índices
    await queryRunner.query(
      `CREATE INDEX "IDX_event_item_eventId" ON "event_item" ("eventId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_member_based_event_item_eventId" ON "member_based_event_item" ("eventId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "member_based_event_item"`);
    await queryRunner.query(`DROP TABLE "event_item"`);
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
