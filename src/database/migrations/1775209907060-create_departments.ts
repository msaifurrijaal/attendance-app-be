import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDepartments1775209907060 implements MigrationInterface {
    name = 'CreateDepartments1775209907060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`departments\` (\`id\` varchar(36) NOT NULL, \`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_91fddbe23e927e1e525c152baa\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_91fddbe23e927e1e525c152baa\` ON \`departments\``);
        await queryRunner.query(`DROP TABLE \`departments\``);
    }

}
