import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLeaveTable1752078198977 implements MigrationInterface {
  name = 'CreateLeaveTable1752078198977';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`leaves\` (\`id\` varchar(36) NOT NULL, \`reason\` text NOT NULL, \`date_start\` date NOT NULL, \`date_end\` date NOT NULL, \`staff_id\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`leaves\` ADD CONSTRAINT \`FK_8b17e2fe9388aa3ea8490e5aa61\` FOREIGN KEY (\`staff_id\`) REFERENCES \`staff\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`leaves\` DROP FOREIGN KEY \`FK_8b17e2fe9388aa3ea8490e5aa61\``,
    );
    await queryRunner.query(`DROP TABLE \`leaves\``);
  }
}
