import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoles1775208916517 implements MigrationInterface {
  name = 'CreateRoles1775208916517';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id\` varchar(36) NOT NULL, \`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_f6d54f95c31b73fb1bdd8e91d0\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_f6d54f95c31b73fb1bdd8e91d0\` ON \`roles\``,
    );
    await queryRunner.query(`DROP TABLE \`roles\``);
  }
}
