import { envChecker } from './envChecker';
import { transport } from './mail';

export const send = (to: string, subject: string, body: string): void => {
  transport.sendMail({
    from: `${envChecker(process.env.EMAIL_NAME)} <${envChecker(process.env.EMAIL_FROM)}>`,
    to,
    subject,
    html: body
  });
};
