import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Requests1712103659724 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true
          },
          {
            name: 'user_id',
            type: 'integer'
          },
          {
            name: 'observation',
            type: 'text',
            isNullable: true
          },
          {
            name: 'total_value',
            type: 'integer'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('order');
  }
}

