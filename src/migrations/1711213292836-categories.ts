import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Categories1711213292836 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true
          },
          {
            name: 'description',
            type: 'text'
          }
        ]
      })
    );

    await queryRunner.query(`
      INSERT INTO categories (description) VALUES
      ('Pizzas'),
      ('Beverages'),
      ('Appetizers'),
      ('Desserts')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('categories');
  }
}
