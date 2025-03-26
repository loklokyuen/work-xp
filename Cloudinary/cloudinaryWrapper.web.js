const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY;
const apiSecret = process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET;

export const uploadImage = async (image) => {
	try {
		const formData = new FormData();
		formData.append("file", image.file);
		formData.append("upload_preset", "profile_img");
		formData.append("folder", "Profile");
		formData.append("unsigned", "true");
		const response = await fetch(
			`https://api.cloudinary.com/v1_1/${cloudName}/upload`,
			{
				method: "POST",
				body: formData,
			}
		);
		const data = await response.json();
		return data.secure_url;
	} catch (error) {
		return false;
	}
};

export const deleteImage = async (publicId) => {
	try {
		const timestamp = Math.floor(Date.now() / 1000);
		const stringToSign = `public_id=Profile/${publicId}&timestamp=${timestamp}${apiSecret}`;
		const signature = await generateSignature(stringToSign);
		const formData = new FormData();
		formData.append("public_id", `Profile/${publicId}`);
		formData.append("api_key", apiKey);
		formData.append("timestamp", timestamp);
		formData.append("signature", signature);
		const response = await fetch(
			`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
			{
				method: "POST",
				body: formData,
			}
		);
		const data = await response.json();
	} catch (error) {
		// console.error('Delete error:', error);
	}
};
const generateSignature = async (stringToSign) => {
	const encoder = new TextEncoder();
	const data = encoder.encode(stringToSign);
	const hashBuffer = await crypto.subtle.digest("SHA-1", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};
