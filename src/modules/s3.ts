import { S3 } from "aws-sdk";

export const getS3Instance = () => {
  return new S3({
    credentials: {
      accessKeyId: `${process.env.ACCESS_ID}`,
      secretAccessKey: `${process.env.SECRET_ACCESS_KEY}`,
    },
  });
};
