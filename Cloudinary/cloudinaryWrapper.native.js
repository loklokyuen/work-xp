import { Cloudinary } from '@cloudinary/url-gen'; 
import { upload } from "cloudinary-react-native";
// interface UploadImageProps {
//     image: {uri: string};
// }

export const uploadImage = async (image)=>{
    const cld = new Cloudinary({
        cloud: {
            cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY,
            apiSecret: process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET
        },
        url: {
            secure: true
        }
    });
    const options = {
        upload_preset: 'profile_img',
        folder: 'Profile',
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
