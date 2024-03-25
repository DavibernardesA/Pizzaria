import { ServerError } from '../helpers/api-error';

export const envChecker = (variable: string | undefined): string => {
  const env = variable;

  if (!env) {
    throw new ServerError(`Environment variable ${variable} is not set`);
  }

  return env;
};
