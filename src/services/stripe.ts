import { Card, MoneyType } from '../@types/stripe';
import { axiosInstance } from './api';
import qs from 'qs';

export const createToken: (card: Card) => Promise<any> = async (card: Card): Promise<any> => {
  const dataCard: string = qs.stringify(card);

  const { data: cardToken } = await axiosInstance.post('/tokens', dataCard);

  return cardToken;
};

export const demand: (amount: number, moneyType: MoneyType, token: any) => Promise<any> = async (
  amount: number,
  moneyType: string,
  token: any
): Promise<any> => {
  const data: string = qs.stringify({
    amount,
    currency: moneyType,
    source: token
  });

  const { data: charge } = await axiosInstance.post('/charges', data);

  return charge;
};
