import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Address } from '../entities/Address';

export const addressRepository: Repository<Address> & {
  findByZipcode(name: string): Promise<Address[]>;
} = AppDataSource.getRepository(Address).extend({
  async findByZipcode(zipcode: string) {
    return this.find({ where: { zipcode } });
  }
});
