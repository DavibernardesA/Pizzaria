import { PutObjectCommand } from '@aws-sdk/client-s3';
import { envChecker } from '../utils/envChecker';
import { s3Client } from './aws';
import { User } from '../entities/User';
import { Product } from '../entities/Product';

export const updateImage = async (user: User | Product, folder: string, image: Express.Multer.File): Promise<string> => {
  const key: string = `${folder}/${encodeURI(user.avatar)}`;

  const s3URL: string = `https://${envChecker(process.env.ENDPOINT_BUCKET)}/${key}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: envChecker(process.env.KEY_NAME_BUCKET),
      Key: key,
      Body: image.buffer,
      ContentType: image.mimetype
    })
  );

  return s3URL;
};
