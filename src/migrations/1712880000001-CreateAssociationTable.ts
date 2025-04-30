import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAssociationTable1712880000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if association table exists
    const associationTableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'association'
      )
    `);

    if (!associationTableExists[0].exists) {
      await queryRunner.query(`
        CREATE TABLE "association" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "name" character varying NOT NULL,
          "country" character varying NOT NULL,
          CONSTRAINT "PK_association" PRIMARY KEY ("id")
        )
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "association"`);
  }
}
