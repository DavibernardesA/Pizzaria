import { Request, Response } from 'express';
import { InvalidFormatError, NotFoundError, UnauthorizedError } from '../helpers/api-error';
import chat from '../chat/statusMessage';
import { userRepository } from '../repositories/userRepository';
import { User } from '../entities/User';
import { addressRepository } from '../repositories/addressRepository';
import { Address } from '../entities/Address';

export class AddressController {
  async store(req: Request, res: Response) {
    const { id } = req.params;
    const { city, complement, house_number, neighborhood, password, state, street, zipcode } = req.body;

    const userId: number = parseInt(id);

    if (!id || isNaN(userId)) {
      throw new InvalidFormatError(chat.error400);
    }

    const user: User | null = await userRepository.findOne({
      where: { id: userId },
      relations: {
        address: true
      }
    });

    if (!user) {
      throw new NotFoundError(chat.error404);
    }

    if (user.address) {
      throw new InvalidFormatError(chat.error400);
    }

    const newAddress: Omit<Address, 'id'> = {
      city,
      complement,
      house_number,
      neighborhood,
      state,
      street,
      zipcode,
      user_id: user.id
    };

    if (user.id !== req.user.id) {
      throw new UnauthorizedError(chat.error401);
    }

    const savedAddress: Address = await addressRepository.create(newAddress);
    await addressRepository.save(savedAddress);

    return res.status(200).json(newAddress);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const addressId: number = parseInt(id);

    if (!id || isNaN(addressId)) {
      throw new InvalidFormatError(chat.error400);
    }

    const address: Address | null = await addressRepository.findOne({
      where: { id: addressId }
    });

    if (!address) {
      throw new NotFoundError(chat.error404);
    }

    return res.status(200).json(address);
  }

  async destroy(req: Request, res: Response) {
    const { id } = req.params;

    const addressId: number = parseInt(id);

    if (!id || isNaN(addressId)) {
      throw new InvalidFormatError(chat.error400);
    }

    const address: Address | null = await addressRepository.findOne({
      where: { id: addressId }
    });

    if (!address) {
      throw new NotFoundError(chat.error404);
    }

    if (address.user_id !== req.user.id) {
      throw new UnauthorizedError(chat.error401);
    }

    await addressRepository.remove(address);

    return res.status(203).json();
  }
}
