const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  const options = { folder };
  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }
  options.resourse_type = "auto";
  try {
    const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, options);
    return uploadResult; // Returns the result which includes the URL of the uploaded image
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Image upload failed');
  }
};