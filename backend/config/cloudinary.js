// Cloudinary configuration (prepared for future file uploads).
// Not used directly in current endpoints, but ready to be integrated.
import { v2 as cloudinary } from "cloudinary";

export const configureCloudinary = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME) return;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export default cloudinary;