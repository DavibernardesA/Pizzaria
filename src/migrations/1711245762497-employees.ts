import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Employees1711245762497 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'employees',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true
          },
          {
            name: 'name',
            type: 'text',
            isNullable: true
          },
          {
            name: 'email',
            type: 'text',
            isUnique: true
          },
          {
            name: 'password',
            type: 'text'
          },
          {
            name: 'avatar',
            type: 'text',
            isNullable: true
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('employees');
  }
}
