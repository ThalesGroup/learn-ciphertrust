import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  region: process.env.AWS_S3_REGION,
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS,
  signatureVersion: "v4",
});

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const fileName = `${req.body.key}-${Math.ceil(Math.random() * 100000)}.json`;
  
  try {
    const fileParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Expires: 600,
      ContentType: "application/json",
    };

    const url = await s3.getSignedUrlPromise("putObject", fileParams);

    res.status(200).json({ 
      url, 
      afterUploadURL: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}` 
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err });
  }
};