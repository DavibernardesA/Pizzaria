import { NextFunction, Request, Response } from 'express';
import { InvalidFormatError, ServerError } from '../helpers/api-error';
import axios from 'axios';
import chat from '../chat/statusMessage';
import { userRepository } from '../repositories/userRepository';
import { Address } from '../entities/Address';
import { User } from '../entities/User';

export const validateAdress = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const userId: number = parseInt(id);

  const user: User | null = await userRepository.findOne({
    where: { id: userId },
    relations: {
      address: true
    }
  });

  if (!user) {
    throw new InvalidFormatError(chat.error400);
  }

  const address: Address | undefined = user.address;

  if (!address) {
    throw new InvalidFormatError(chat.error400);
  }

  const stringAdress: string = `${address.street}, house n°${address.house_number}, ${address.neighborhood}, ${address.city} - ${address.state}, zipcode: ${address.zipcode}.`;

  console.log(`Valid Address: ${stringAdress}`);
  next();
  // const pizzaAddress: string = process.env.ZIP_PIZZA || '';
  // const distanceFromOrder = (process.env.ORDER_IN_KM as number | undefined) || 7;

  // // Requesting Google Maps Geocoding API to get the coordinates of the address
  // const encodedAddress: string = encodeURIComponent(stringAdress);
  // const geocodingUrl: string = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.API_KEY_MAPS}`;

  // const geocodingResponse = await axios.get(geocodingUrl);
  // const geocodingData = geocodingResponse.data;

  // if (geocodingData.status === 'OK' && geocodingData.results.length > 0) {
  //   const addressCoordinates = geocodingData.results[0].geometry.location;

  //   // Requesting Google Maps Distance Matrix API to calculate the distance to the pizzeria
  //   const distanceMatrixUrl: string = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${addressCoordinates.lat},${addressCoordinates.lng}&destinations=${pizzaAddress}&key=${process.env.API_KEY_MAPS}`;

  //   const distanceMatrixResponse = await axios.get(distanceMatrixUrl);
  //   const distanceMatrixData = distanceMatrixResponse.data;

  //   if (distanceMatrixData.status === 'OK') {
  //     const distanceInKm: number = distanceMatrixData.rows[0].elements[0].distance.value / 1000; // Converting to kilometers

  //     const distanceValidated: boolean = distanceInKm <= distanceFromOrder;

  //     if (distanceValidated) {
  //       next();
  //     } else {
  //       throw new InvalidFormatError('The address is outside our delivery area');
  //     }
  //   } else {
  //     throw new ServerError('Error calculating the distance');
  //   }
  // } else {
  //   throw new InvalidFormatError('Invalid address');
  // }
};
