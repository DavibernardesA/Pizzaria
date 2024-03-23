import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Users1711072669430 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
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
    queryRunner.dropTable('users');
  }
}
