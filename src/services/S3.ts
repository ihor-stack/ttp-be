import * as Minio from 'minio';

export default class S3 {
  private static instance: S3;

  minioClient;

  public static getInstance() {
    if (!S3.instance) {
      S3.instance = new S3();
    }

    return S3.instance;
  }

  public resetInstance() {
    S3.instance = new S3();

    return S3.instance;
  }

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.S3_ENDPOINT,
      accessKey: process.env.S3_ACCESS_KEY,
      secretKey: process.env.S3_SECRET_KEY,
    });
  }

  async uploadImage(file) {
    try {
      const objectFileName = file.originalname;
      const metadata = {
        'x-amz-acl': 'public-read',
      };
      const submitFileDataResult = await this.minioClient.putObject(
        process.env.S3_BUCKET,
        objectFileName,
        file.buffer,
        file.size,
        metadata
      );

      console.log('File data submitted successfully: ', submitFileDataResult);
    } catch (err) {
      console.log('err', err);
    }
  }
}
