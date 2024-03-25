import nodemailer from 'nodemailer';
import { envChecker } from './envChecker';

export const transport: nodemailer.Transporter<unknown> = nodemailer.createTransport({
  host: envChecker(process.env.EMAIL_HOST),
  port: envChecker(process.env.EMAIL_PORT),
  auth: {
    user: envChecker(process.env.EMAIL_USER),
    pass: envChecker(process.env.EMAIL_PASS)
  }
} as nodemailer.TransportOptions);
