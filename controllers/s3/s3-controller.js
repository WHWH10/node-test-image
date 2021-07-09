var AWS = require("aws-sdk");
var dotenv = require("dotenv");
var path = require("path");
var multer = require("multer");

dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV == "production" ? ".env" : ".env.dev"
  ),
});

const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint(process.env.NAVER_CLOUD_END_POINT),
  region: "kr-standard",
  credentials: {
    accessKeyId: process.env.NAVER_CLOUD_KEY_ID,
    secretAccessKey: process.env.NAVER_CLOUD_SECRET_KEY,
  },
});

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

const singleUpload = multer({ storage: storage }).single("single");
const multipleUpload = multer({ storage: storage }).array("multiple");

module.exports = {
  s3: s3,
  storage: storage,
  singleUpload: singleUpload,
};
