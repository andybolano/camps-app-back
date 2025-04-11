import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovePercentageColumns1712822400000
  implements MigrationInterface
{
  name = 'RemovePercentageColumns1712822400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tablas temporales sin las columnas de porcentaje
    await queryRunner.query(`
      CREATE TABLE "event_item_temp" (
        "id" SERIAL PRIMARY KEY,
        "name" varchar NOT NULL,
        "eventId" integer,
        CONSTRAINT "FK_6b0c3d2c8b3d3d3d3d3d3d3d3d3d" FOREIGN KEY ("eventId") REFERENCES "event" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "member_based_event_item_temp" (
        "id" SERIAL PRIMARY KEY,
        "name" varchar NOT NULL,
        "applicableCharacteristics" text NOT NULL,
        "calculationType" varchar NOT NULL DEFAULT 'PROPORTION',
        "isRequired" boolean NOT NULL DEFAULT false,
        "eventId" integer,
        CONSTRAINT "FK_7b0c3d2c8b3d3d3d3d3d3d3d3d" FOREIGN KEY ("eventId") REFERENCES "event" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Copiar datos de las tablas originales a las temporales
    await queryRunner.query(`
      INSERT INTO "event_item_temp" ("id", "name", "eventId")
      SELECT "id", "name", "eventId" FROM "event_item"
    `);

    await queryRunner.query(`
      INSERT INTO "member_based_event_item_temp" ("id", "name", "applicableCharacteristics", "calculationType", "isRequired", "eventId")
      SELECT "id", "name", "applicableCharacteristics", "calculationType", "isRequired", "eventId" FROM "member_based_event_item"
    `);

    // Eliminar las tablas originales
    await queryRunner.query(`DROP TABLE "event_item"`);
    await queryRunner.query(`DROP TABLE "member_based_event_item"`);

    // Renombrar las tablas temporales
    await queryRunner.query(
      `ALTER TABLE "event_item_temp" RENAME TO "event_item"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_based_event_item_temp" RENAME TO "member_based_event_item"`,
    );

    // Recrear los índices
    await queryRunner.query(
      `CREATE INDEX "IDX_6b0c3d2c8b3d3d3d3d3d3d3d3d3d" ON "event_item" ("eventId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7b0c3d2c8b3d3d3d3d3d3d3d3d3d" ON "member_based_event_item" ("eventId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Crear tablas temporales con las columnas de porcentaje
    await queryRunner.query(`
      CREATE TABLE "event_item_temp" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "name" varchar NOT NULL,
        "percentage" float NOT NULL,
        "eventId" integer,
        CONSTRAINT "FK_6b0c3d2c8b3d3d3d3d3d3d3d3d3d" FOREIGN KEY ("eventId") REFERENCES "event" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "member_based_event_item_temp" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "name" varchar NOT NULL,
        "percentage" float NOT NULL,
        "applicableCharacteristics" text NOT NULL,
        "calculationType" varchar NOT NULL DEFAULT 'PROPORTION',
        "isRequired" boolean NOT NULL DEFAULT (0),
        "eventId" integer,
        CONSTRAINT "FK_7b0c3d2c8b3d3d3d3d3d3d3d3d3d" FOREIGN KEY ("eventId") REFERENCES "event" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Copiar datos de las tablas actuales a las temporales (con valores por defecto para percentage)
    await queryRunner.query(`
      INSERT INTO "event_item_temp" ("id", "name", "percentage", "eventId")
      SELECT "id", "name", 0, "eventId" FROM "event_item"
    `);

    await queryRunner.query(`
      INSERT INTO "member_based_event_item_temp" ("id", "name", "percentage", "applicableCharacteristics", "calculationType", "isRequired", "eventId")
      SELECT "id", "name", 0, "applicableCharacteristics", "calculationType", "isRequired", "eventId" FROM "member_based_event_item"
    `);

    // Eliminar las tablas actuales
    await queryRunner.query(`DROP TABLE "event_item"`);
    await queryRunner.query(`DROP TABLE "member_based_event_item"`);

    // Renombrar las tablas temporales
    await queryRunner.query(
      `ALTER TABLE "event_item_temp" RENAME TO "event_item"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_based_event_item_temp" RENAME TO "member_based_event_item"`,
    );

    // Recrear los índices
    await queryRunner.query(
      `CREATE INDEX "IDX_6b0c3d2c8b3d3d3d3d3d3d3d3d3d" ON "event_item" ("eventId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7b0c3d2c8b3d3d3d3d3d3d3d3d3d" ON "member_based_event_item" ("eventId")`,
    );
  }
}
