import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1712822400001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL PRIMARY KEY,
                "username" character varying NOT NULL UNIQUE,
                "password" character varying NOT NULL,
                "role" character varying NOT NULL DEFAULT 'user'
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
