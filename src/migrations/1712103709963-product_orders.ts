import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ProductOrders1712103709963 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product_orders',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true
          },
          {
            name: 'order_id',
            type: 'integer'
          },
          {
            name: 'product_id',
            type: 'integer'
          },
          {
            name: 'quantity',
            type: 'integer'
          },
          {
            name: 'value',
            type: 'integer'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('product_order');
  }
}

