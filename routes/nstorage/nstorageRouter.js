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

let upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.NAVER_CLOUD_BUCKET_NAME,
    key: function (req, file, cb) {
      let extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension);
    },
    acl: "public-read",
  }),
});

router.get("", (req, res) => {
  res.render("nstorage/nstorage_main", {
    listTitle: commonFc.day,
  });
});

router.get("/upload/single", (req, res) => {
  res.render("nstorage/nstorage_single");
});

router.post("/upload/single", upload.single("single"), (req, res) => {
  let imgFile = req.file;
  res.json(imgFile);
});

module.exports = router;
