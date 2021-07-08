const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const commonFc = require("../../utils/common/function");

const router = express.Router();

const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint(process.env.NAVER_CLOUD_END_POINT),
  region: "kr-standard",
  credentials: {
    accessKeyId: process.env.NAVER_CLOUD_ACCESS_KEY_ID,
    secretAccessKey: process.env.NAVER_CLOUD_SECRET_KEY,
  },
});

// let upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
//     key: function (req, file, cb) {
//       let extension = path.extname(file.originalname);
//       cb(null, Date.now().toString() + extension);
//     },
//     acl: "public-read",
//   }),
// });

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

const upload = multer({ storage: storage }).single("single");

router.get("", (req, res) => {
  res.render("nstorage/nstorage_main", {
    listTitle: commonFc.day,
  });
});

router.get("/upload/single", (req, res) => {
  res.render("nstorage/nstorage_single");
});

router.post("/upload/single", upload, (req, res) => {
  const file = req.file;
  let fileName = file.originalname.split(".");
  let fileType = fileName[fileName.length - 1];
  let fileMimeType = file.mimetype;
  let labNum = fileName[0].split("-")[3];
  let filePath =
    process.env.NAVER_CLOUD_BUCKET_NAME +
    "/" +
    labNum +
    "/" +
    commonFc.day +
    "/";

  if (file.mimetype.startsWith("image")) {
    const params = {
      Bucket: filePath + "image",
      Body: file.buffer,
      ACL: "public-read-write",
      Key: fileName[0] + "." + fileType,
    };
    try {
      return putObject();
    } catch (err) {
      return new ResponseMessage().error(400, err).build();
    }
  }
  console.log(`filePath :: ${filePath}`);
});

// router.post("/upload/single", upload.single("single"), (req, res) => {
//   let imgFile = req.file;
//   res.json(imgFile);
// });

module.exports = router;
