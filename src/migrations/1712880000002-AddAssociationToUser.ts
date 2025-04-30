import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAssociationToUser1712880000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if associationId column exists
    const columnExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user' 
        AND column_name = 'associationId'
      )
    `);

    if (!columnExists[0].exists) {
      await queryRunner.query(`
        ALTER TABLE "user"
        ADD COLUMN "associationId" uuid,
        ADD CONSTRAINT "FK_user_association" 
        FOREIGN KEY ("associationId") 
        REFERENCES "association"("id") 
        ON DELETE NO ACTION 
        ON UPDATE NO ACTION
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Check if the foreign key constraint exists
    const constraintExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_schema = 'public' 
        AND table_name = 'user' 
        AND constraint_name = 'FK_user_association'
      )
    `);

    if (constraintExists[0].exists) {
      await queryRunner.query(
        `ALTER TABLE "user" DROP CONSTRAINT "FK_user_association"`,
      );
    }

    // Check if the column exists
    const columnExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user' 
        AND column_name = 'associationId'
      )
    `);

    if (columnExists[0].exists) {
      await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "associationId"`);
    }
  }
}
