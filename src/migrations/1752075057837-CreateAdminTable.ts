import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminTable1752075057837 implements MigrationInterface {
  name = 'CreateAdminTable1752075057837';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`admins\` (
                \`id\` varchar(36) NOT NULL,
                \`first_name\` varchar(255) NOT NULL,
                \`last_name\` varchar(255) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`date_of_birth\` date NOT NULL,
                \`gender\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`IDX_051db7d37d478a69a7432df128\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_051db7d37d478a69a7432df128\` ON \`admins\``,
    );
    await queryRunner.query(`DROP TABLE \`admins\``);
  }
}
