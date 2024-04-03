import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from './aws';
import { envChecker } from '../utils/envChecker';

export const fileUpload = async (name: string, folder: string, avatar: Express.Multer.File): Promise<string> => {
  const Key: string = `${folder}/${encodeURIComponent(name)}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.KEY_NAME_BUCKET!,
      Key,
      Body: avatar.buffer,
      ContentType: avatar.mimetype
    })
  );

  const s3URL: string = `http://${envChecker(process.env.ENDPOINT_BUCKET)}/${Key}`;

  return s3URL;
};
