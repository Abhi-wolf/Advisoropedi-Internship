const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

async function uploadToCloudinary(localFilePath) {
  var mainFolderName = "profiles";
  var filePathOnCloudinary = mainFolderName + "/" + localFilePath;

  return cloudinary.uploader
    .upload(localFilePath, { public_id: filePathOnCloudinary })
    .then((result) => {
      fs.unlinkSync(localFilePath);

      return {
        message: "Success",
        url: result.url,
      };
    })
    .catch((err) => {
      fs.unlinkSync(localFilePath);
      return { message: "Fail" };
    });
}

module.exports = uploadToCloudinary;
