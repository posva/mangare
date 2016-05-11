const cloudinary = require('cloudinary')

if (process.env.NODE_ENV === 'production') {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })
}

function upload (url) {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(url, (result) => {
      resolve(result.secure_url)
    })
  })
}

function devUpload (url) {
  return new Promise((resolve) => {
    resolve(url)
  })
}

module.exports = {
  upload: process.env.NODE_ENV === 'production' ? upload : devUpload
}

