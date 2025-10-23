import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeCategoryMandatoryForCamp1761185752633
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Primero, verificar si hay campamentos sin categoría y asignarles una por defecto
    // Usaremos la primera categoría activa como default
    await queryRunner.query(`
      UPDATE "camp"
      SET "targetCategoryId" = (
        SELECT id FROM "category" WHERE "isActive" = true ORDER BY id LIMIT 1
      )
      WHERE "targetCategoryId" IS NULL;
    `);

    // Ahora podemos hacer la columna NOT NULL de forma segura
    await queryRunner.query(`
      ALTER TABLE "camp"
      ALTER COLUMN "targetCategoryId" SET NOT NULL;
    `);

    console.log(
      '✅ Migration completed: targetCategoryId is now mandatory for camps',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir el cambio, haciendo la columna nullable nuevamente
    await queryRunner.query(`
      ALTER TABLE "camp"
      ALTER COLUMN "targetCategoryId" DROP NOT NULL;
    `);

    console.log('⚠️ Migration reverted: targetCategoryId is now nullable again');
  }
}
