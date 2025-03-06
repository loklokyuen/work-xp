export const uploadImage = async (image) => {
    try {
  const formData = new FormData();
  formData.append('file', image.file);
  formData.append('upload_preset', 'profile_img');
const options = {
    upload_preset: 'profile_img',
    folder: 'Profile',
    unsigned: true
};
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );
  const data = await response.json();
  if (!response.ok) {
    console.error('Cloudinary response:', data);
    throw new Error(`Upload failed: ${data.error?.message || response.statusText}`);
  }
  alert(data.secure_url);
  return data.secure_url;
} catch (error) {
    console.error('Web upload error:', error);
    throw error;
  }
};