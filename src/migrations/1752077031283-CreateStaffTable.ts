import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStaffTable1752077031283 implements MigrationInterface {
  name = 'CreateStaffTable1752077031283';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_051db7d37d478a69a7432df128\` ON \`admins\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`staff\` (\`id\` varchar(36) NOT NULL, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`no_hp\` varchar(255) NOT NULL, \`address\` text NOT NULL, \`gender\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_902985a964245652d5e3a0f5f6\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`admins\` ADD UNIQUE INDEX \`IDX_051db7d37d478a69a7432df147\` (\`email\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`admins\` DROP INDEX \`IDX_051db7d37d478a69a7432df147\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_902985a964245652d5e3a0f5f6\` ON \`staff\``,
    );
    await queryRunner.query(`DROP TABLE \`staff\``);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_051db7d37d478a69a7432df128\` ON \`admins\` (\`email\`)`,
    );
  }
}
