import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1712822400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear extensión UUID
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Check if members_type_enum exists
    const typeEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'members_type_enum'
      )
    `);

    if (!typeEnumExists[0].exists) {
      await queryRunner.query(`
        CREATE TYPE "public"."members_type_enum" AS ENUM(
          'baptized',
          'not_baptized',
          'economa',
          'guest',
          'companion',
          'director'
        )
      `);
    }

    // Check if members_status_enum exists
    const statusEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'members_status_enum'
      )
    `);

    if (!statusEnumExists[0].exists) {
      await queryRunner.query(`
        CREATE TYPE "public"."members_status_enum" AS ENUM(
          'active',
          'inactive'
        )
      `);
    }

    // Check if user table exists
    const userTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user'
      )
    `);

    if (!userTableExists[0].exists) {
      await queryRunner.query(`
        CREATE TABLE "user" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "username" character varying NOT NULL,
          "password" character varying NOT NULL,
          "role" character varying NOT NULL DEFAULT 'user',
          CONSTRAINT "UQ_user_username" UNIQUE ("username"),
          CONSTRAINT "PK_user" PRIMARY KEY ("id")
        )
      `);
    }

    // Check if camp table exists
    const campTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'camp'
      )
    `);

    if (!campTableExists[0].exists) {
      await queryRunner.query(`
        CREATE TABLE "camp" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "name" character varying NOT NULL,
          "location" character varying NOT NULL,
          "startDate" timestamp NOT NULL,
          "endDate" timestamp NOT NULL,
          "description" text,
          "logoUrl" character varying,
          CONSTRAINT "PK_camp" PRIMARY KEY ("id")
        )
      `);
    }

    // Check if club table exists
    const clubTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'club'
      )
    `);

    if (!clubTableExists[0].exists) {
      await queryRunner.query(`
        CREATE TABLE "club" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "name" character varying NOT NULL,
          "slogan" character varying NOT NULL,
          "city" character varying NOT NULL,
          "foundationDate" date NOT NULL,
          "shieldUrl" character varying,
          CONSTRAINT "PK_club" PRIMARY KEY ("id")
        )
      `);
    }

    // Check if members table exists
    const membersTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'members'
      )
    `);

    if (!membersTableExists[0].exists) {
      await queryRunner.query(`
        CREATE TABLE "members" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "firstName" character varying NOT NULL,
          "lastName" character varying NOT NULL,
          "identification" character varying NOT NULL,
          "birthDate" date NOT NULL,
          "type" "public"."members_type_enum" NOT NULL DEFAULT 'not_baptized',
          "status" "public"."members_status_enum" NOT NULL DEFAULT 'active',
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          "clubId" uuid,
          CONSTRAINT "PK_members" PRIMARY KEY ("id"),
          CONSTRAINT "FK_members_club" FOREIGN KEY ("clubId") 
            REFERENCES "club"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )
      `);
    }

    // Check if event table exists
    const eventTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'event'
      )
    `);

    if (!eventTableExists[0].exists) {
      await queryRunner.query(`
        CREATE TABLE "event" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "name" character varying NOT NULL,
          "description" text,
          "type" character varying NOT NULL DEFAULT 'REGULAR',
          "startDate" timestamp NOT NULL,
          "endDate" timestamp NOT NULL,
          "maxScore" integer NOT NULL DEFAULT 100,
          "campId" uuid,
          CONSTRAINT "PK_event" PRIMARY KEY ("id"),
          CONSTRAINT "FK_event_camp" FOREIGN KEY ("campId") 
            REFERENCES "camp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )
      `);
    }

    // Check if event_item table exists
    const eventItemTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'event_item'
      )
    `);

    if (!eventItemTableExists[0].exists) {
      await queryRunner.query(`
        CREATE TABLE "event_item" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "name" character varying NOT NULL,
          "eventId" uuid,
          CONSTRAINT "PK_event_item" PRIMARY KEY ("id"),
          CONSTRAINT "FK_event_item_event" FOREIGN KEY ("eventId") 
            REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )
      `);
    }

    // Check if member_based_event_item table exists
    const memberBasedEventItemTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'member_based_event_item'
      )
    `);

    if (!memberBasedEventItemTableExists[0].exists) {
      await queryRunner.query(`
        CREATE TABLE "member_based_event_item" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "name" character varying NOT NULL,
          "applicableCharacteristics" text NOT NULL,
          "calculationType" character varying NOT NULL DEFAULT 'PROPORTION',
          "isRequired" boolean NOT NULL DEFAULT false,
          "eventId" uuid,
          CONSTRAINT "PK_member_based_event_item" PRIMARY KEY ("id"),
          CONSTRAINT "FK_member_based_event_item_event" FOREIGN KEY ("eventId") 
            REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )
      `);
    }

    // Check if result table exists
    const resultTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'result'
      )
    `);

    if (!resultTableExists[0].exists) {
      await queryRunner.query(`
        CREATE TABLE "result" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "totalScore" float NOT NULL DEFAULT 0,
          "clubId" uuid,
          "eventId" uuid,
          CONSTRAINT "PK_result" PRIMARY KEY ("id"),
          CONSTRAINT "FK_result_club" FOREIGN KEY ("clubId") 
            REFERENCES "club"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT "FK_result_event" FOREIGN KEY ("eventId") 
            REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )
      `);

      // Crear índices para la tabla result inmediatamente después de crearla
      await queryRunner.query(
        `CREATE INDEX IF NOT EXISTS "IDX_result_club" ON "result" ("clubId")`,
      );
      await queryRunner.query(
        `CREATE INDEX IF NOT EXISTS "IDX_result_event" ON "result" ("eventId")`,
      );
    }

    // Check if result_item table exists
    const resultItemTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'result_item'
      )
    `);

    if (!resultItemTableExists[0].exists) {
      await queryRunner.query(`
        CREATE TABLE "result_item" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "score" float NOT NULL,
          "resultId" uuid,
          "eventItemId" uuid,
          CONSTRAINT "PK_result_item" PRIMARY KEY ("id"),
          CONSTRAINT "FK_result_item_result" FOREIGN KEY ("resultId") 
            REFERENCES "result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT "FK_result_item_event_item" FOREIGN KEY ("eventItemId") 
            REFERENCES "event_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )
      `);
    }

    // Check if result_member_based_item table exists
    const resultMemberBasedItemTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'result_member_based_item'
      )
    `);

    if (!resultMemberBasedItemTableExists[0].exists) {
      await queryRunner.query(`
        CREATE TABLE "result_member_based_item" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "score" float NOT NULL,
          "totalWithCharacteristic" integer NOT NULL DEFAULT 0,
          "matchCount" integer NOT NULL DEFAULT 0,
          "resultId" uuid,
          "eventItemId" uuid,
          CONSTRAINT "PK_result_member_based_item" PRIMARY KEY ("id"),
          CONSTRAINT "FK_result_member_based_item_result" FOREIGN KEY ("resultId") 
            REFERENCES "result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT "FK_result_member_based_item_event_item" FOREIGN KEY ("eventItemId") 
            REFERENCES "member_based_event_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )
      `);
    }

    // Check if club_camps_camp table exists
    const clubCampsCampTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'club_camps_camp'
      )
    `);

    if (!clubCampsCampTableExists[0].exists) {
      await queryRunner.query(`
        CREATE TABLE "club_camps_camp" (
          "clubId" uuid NOT NULL,
          "campId" uuid NOT NULL,
          CONSTRAINT "PK_club_camps_camp" PRIMARY KEY ("clubId", "campId"),
          CONSTRAINT "FK_club_camps_camp_club" FOREIGN KEY ("clubId") 
            REFERENCES "club"("id") ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT "FK_club_camps_camp_camp" FOREIGN KEY ("campId") 
            REFERENCES "camp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )
      `);
    }

    // Crear índices
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_club_camps_club" ON "club_camps_camp" ("clubId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_club_camps_camp" ON "club_camps_camp" ("campId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_members_club" ON "members" ("clubId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_event_camp" ON "event" ("campId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_event_item_event" ON "event_item" ("eventId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_member_based_event_item_event" ON "member_based_event_item" ("eventId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_result_item_result" ON "result_item" ("resultId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_result_item_event_item" ON "result_item" ("eventItemId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_result_member_based_item_result" ON "result_member_based_item" ("resultId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_result_member_based_item_event_item" ON "result_member_based_item" ("eventItemId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índices
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_result_member_based_item_event_item"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_result_member_based_item_result"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_result_item_event_item"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_result_item_result"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_result_event"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_result_club"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_member_based_event_item_event"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_event_item_event"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_event_camp"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_members_club"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_club_camps_camp"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_club_camps_club"`);

    // Eliminar tablas
    await queryRunner.query(`DROP TABLE IF EXISTS "club_camps_camp"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "result_member_based_item"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "result_item"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "result"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "member_based_event_item"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "event_item"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "event"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "members"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "club"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "camp"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user"`);

    // Eliminar tipos enum
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."members_status_enum"`,
    );
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."members_type_enum"`);

    // Eliminar extensión UUID
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
  }
}
