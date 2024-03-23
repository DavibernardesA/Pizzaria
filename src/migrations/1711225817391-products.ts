import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class Products1711225817391 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true
          },
          {
            name: 'name',
            type: 'text'
          },
          {
            name: 'price',
            type: 'integer'
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true
          },
          {
            name: 'stock',
            type: 'integer'
          },
          {
            name: 'category_id',
            type: 'integer'
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id']
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }
}

