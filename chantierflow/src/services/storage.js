import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'node:fs/promises';
import path from 'node:path';
import 'dotenv/config';

const s3enabled = process.env.S3_ENABLED === 'true';
const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:3000';

const s3 = s3enabled
    ? new S3Client({
          region: process.env.S3_REGION,
          credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY,
              secretAccessKey: process.env.S3_SECRET_KEY,
          },
      })
    : null;

const LOCAL_DIR = path.resolve('storage');

export async function ensureLocalDir() {
    await fs.mkdir(LOCAL_DIR, { recursive: true });
}

export async function uploadFile(buffer, key, contentType = 'application/pdf') {
    if (s3enabled && s3) {
        await s3.send(new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: key,
            Body: buffer,
            ContentType: contentType,
            ACL: 'public-read',
        }));
        return `${process.env.S3_PUBLIC_BASE_URL}/${key}`;
    }
    await ensureLocalDir();
    const localPath = path.join(LOCAL_DIR, key);
    await fs.mkdir(path.dirname(localPath), { recursive: true });
    await fs.writeFile(localPath, buffer);
    return `${PUBLIC_URL}/files/${key}`;
}
