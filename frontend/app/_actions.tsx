'use server'
import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
config();


const cloudinaryConfig : any = cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, 
});

export async function getSignature() {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp: timestamp,
        },
        cloudinaryConfig.api_secret
    );

    return { timestamp, signature };
}

export async function getImageUrl({ version, signature, public_id }: any) {

    const expextedSignature = cloudinary.utils.api_sign_request(
    {public_id, version},
    cloudinaryConfig.api_secret
    );

    if (expextedSignature === signature) {
        const imageUrl = cloudinary.url(public_id, {
            version,
            signature,
            secure: true,
        });
        return imageUrl;
    }
    return null;
} 