import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class Addresses1711770801623 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'addresses',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true
          },
          {
            name: 'user_id',
            type: 'integer',
            isNullable: true
          },
          {
            name: 'zipcode', // CEP (Código de Endereçamento Postal)
            type: 'text'
          },
          {
            name: 'street', // Rua
            type: 'text',
            isNullable: true
          },
          {
            name: 'house_number', // Número da residência
            type: 'text',
            isNullable: true
          },
          {
            name: 'complement', // Complemento do endereço
            type: 'text',
            isNullable: true
          },
          {
            name: 'neighborhood', // Bairro
            type: 'text',
            isNullable: true
          },
          {
            name: 'city', // Cidade
            type: 'text'
          },
          {
            name: 'state', // Estado
            type: 'text'
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      'addresses',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id']
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('addresses');
  }
}
