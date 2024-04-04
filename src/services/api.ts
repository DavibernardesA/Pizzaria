import axios, { AxiosInstance } from 'axios';
import { envChecker } from '../utils/envChecker';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://api.stripe.com/v1',
  headers: {
    Authorization: `Bearer ${envChecker(process.env.STRIPE_TOKEN)}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});
