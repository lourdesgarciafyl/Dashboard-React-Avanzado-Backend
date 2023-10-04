import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY_CLOUD, 
    api_secret: process.env.API_SECRET_CLOUD,
    secure: true
  });

export const uploadImage = async (filePath) => {
   return await cloudinary.uploader.upload(filePath, {
        folder: 'react-avanzado'
   })
}

export const deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId)
}