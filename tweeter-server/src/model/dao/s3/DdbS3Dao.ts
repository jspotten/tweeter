import {S3Dao} from "./S3Dao";
import {ObjectCannedACL, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";

export class DdbS3Dao implements S3Dao {
    public async putImage(
        fileName: string,
        imageStringBase64Encoded: string
    ): Promise<string> {
        let decodedImageBuffer: Buffer = Buffer.from(
            imageStringBase64Encoded,
            "base64"
        );
        const bucket: string = 'tweeter-images-jaden';
        const region: string = 'us-west-2'

        const s3Params = {
            Bucket: bucket,
            Key: "images/" + fileName,
            Body: decodedImageBuffer,
            ContentType: "image/png",
            ACL: ObjectCannedACL.public_read,
        };
        const c = new PutObjectCommand(s3Params);
        const client = new S3Client({ region: region });
        try {
            await client.send(c);
            return (
                `https://${bucket}.s3.${region}.amazonaws.com/images/${fileName}`
            );
        } catch (error) {
            throw Error("s3 put image failed with: " + error);
        }
    }
}