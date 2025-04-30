import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCampToEvent1712880000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if campId column exists
    const columnExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'event' 
        AND column_name = 'campId'
      )
    `);

    if (!columnExists[0].exists) {
      await queryRunner.query(`
        ALTER TABLE "event"
        ADD COLUMN "campId" uuid,
        ADD CONSTRAINT "FK_event_camp" 
        FOREIGN KEY ("campId") 
        REFERENCES "camp"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Check if the foreign key constraint exists
    const constraintExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_schema = 'public' 
        AND table_name = 'event' 
        AND constraint_name = 'FK_event_camp'
      )
    `);

    if (constraintExists[0].exists) {
      await queryRunner.query(
        `ALTER TABLE "event" DROP CONSTRAINT "FK_event_camp"`,
      );
    }

    // Check if the column exists
    const columnExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'event' 
        AND column_name = 'campId'
      )
    `);

    if (columnExists[0].exists) {
      await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "campId"`);
    }
  }
}
