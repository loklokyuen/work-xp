import { Cloudinary } from '@cloudinary/url-gen'; 
import { upload } from "cloudinary-react-native";
import * as Crypto from 'expo-crypto';

const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY;
const apiSecret = process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET;

const cld = new Cloudinary({
    cloud: {
        cloudName: cloudName,
        apiKey: apiKey,
        apiSecret: apiSecret
    },
    url: {
        secure: true
    }
});
export const uploadImage = async (image)=>{
    const options = {
        upload_preset: 'profile_img',
        unsigned: true
    };
    return new Promise((resolve, reject)=>{
        upload(cld, {file: image.uri, options, callback: (error, response) => {
            if (error) {
                reject(error)
            } else {
                if (response){
                    resolve(response.secure_url);
                    return response.secure_url;
                } else {
                    reject('Upload failed');
                }
            }
        }})
    }) 
}

export const deleteImage = async (publicId) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA1,
        stringToSign
    );
    const formData = new FormData();
    formData.append('public_id', `${publicId}`);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
        {
        method: 'POST',
        body: formData,
        }
    );
  };