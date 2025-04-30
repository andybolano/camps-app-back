import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDirectorAndPastorToClub1712880000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if directorId column exists
    const directorColumnExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'club' 
        AND column_name = 'directorId'
      )
    `);

    if (!directorColumnExists[0].exists) {
      await queryRunner.query(`
        ALTER TABLE "club"
        ADD COLUMN "directorId" uuid,
        ADD CONSTRAINT "FK_club_director" 
        FOREIGN KEY ("directorId") 
        REFERENCES "members"("id") 
        ON DELETE NO ACTION 
        ON UPDATE NO ACTION
      `);
    }

    // Check if pastorId column exists
    const pastorColumnExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'club' 
        AND column_name = 'pastorId'
      )
    `);

    if (!pastorColumnExists[0].exists) {
      await queryRunner.query(`
        ALTER TABLE "club"
        ADD COLUMN "pastorId" uuid,
        ADD CONSTRAINT "FK_club_pastor" 
        FOREIGN KEY ("pastorId") 
        REFERENCES "members"("id") 
        ON DELETE NO ACTION 
        ON UPDATE NO ACTION
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Check and drop pastor foreign key constraint
    const pastorConstraintExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_schema = 'public' 
        AND table_name = 'club' 
        AND constraint_name = 'FK_club_pastor'
      )
    `);

    if (pastorConstraintExists[0].exists) {
      await queryRunner.query(`
        ALTER TABLE "club" DROP CONSTRAINT "FK_club_pastor"
      `);
    }

    // Check and drop director foreign key constraint
    const directorConstraintExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_schema = 'public' 
        AND table_name = 'club' 
        AND constraint_name = 'FK_club_director'
      )
    `);

    if (directorConstraintExists[0].exists) {
      await queryRunner.query(`
        ALTER TABLE "club" DROP CONSTRAINT "FK_club_director"
      `);
    }

    // Check and drop pastorId column
    const pastorColumnExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'club' 
        AND column_name = 'pastorId'
      )
    `);

    if (pastorColumnExists[0].exists) {
      await queryRunner.query(`ALTER TABLE "club" DROP COLUMN "pastorId"`);
    }

    // Check and drop directorId column
    const directorColumnExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'club' 
        AND column_name = 'directorId'
      )
    `);

    if (directorColumnExists[0].exists) {
      await queryRunner.query(`ALTER TABLE "club" DROP COLUMN "directorId"`);
    }
  }
}
