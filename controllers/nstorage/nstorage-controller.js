const AWS = require("aws-sdk");
const multer = require("multer");
const fs = require("fs");
const commonFc = require("../../utils/common/function");
const saveMongoController = require("../mongodb/save-mongodb-controller");

const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint(process.env.NAVER_CLOUD_END_POINT),
  region: "kr-standard",
  credentials: {
    accessKeyId: process.env.NAVER_CLOUD_ACCESS_KEY_ID,
    secretAccessKey: process.env.NAVER_CLOUD_SECRET_KEY,
  },
});

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

const upload = multer({ storage: storage });

const uploadSingleFile = (req, res) => {
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
      ACL: "public-read",
      Key: fileName[0] + "." + fileType,
    };
    uploadImageFile(params)
      .then((result) => {
        // save to mongodb
        const downloadUrl =
          process.env.NAVER_CLOUD_END_POINT +
          "/" +
          filePath +
          "image" +
          "/" +
          fileName[0] +
          "." +
          fileType;

        saveMongoController.saveToMongoImage(downloadUrl, file);

        res.json({
          resultCode: 200,
          resultFileName: result.key,
          resultMessage: "Upload Success",
        });
      })
      .catch((err) => {
        res.json({
          resultCode: 400,
          resultMessage: err,
        });
      });
  } else {
    const params = {
      Bucket: filePath + fileMimeType,
      Body: file.buffer,
      ACL: "public-read", //전체공개 (다운로드 다 가능)
      Key: fileName[0] + "." + fileType,
    };
    uploadOtherFile(params)
      .then((result) => {
        // save to mongodb
        const downloadUrl =
          process.env.NAVER_CLOUD_END_POINT +
          "/" +
          filePath +
          fileMimeType +
          "/" +
          fileName[0] +
          "." +
          fileType;

        if (fileMimeType.includes("octet")) {
          saveMongoController.saveToMongoOctet(file, downloadUrl);
        } else if (fileMimeType.includes("csv")) {
          saveMongoController.saveToMongoCsv(file, downloadUrl);
        } else if (fileMimeType.includes("openxmlformats-officedocument")) {
          saveMongoController.saveToMongoOffice(file, downloadUrl);
        } else {
          console.log("NOTHING");
        }
        res.json({
          resultCode: 200,
          resultFileName: result.key,
          resultMessage: "Upload Success",
        });
      })
      .catch((err) => {
        res.json({
          resultCode: 400,
          resultMessage: err,
        });
      });
    // save to mongodb
  }
};

// 이미지 파일 등록 했을 경우
function uploadImageFile(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// 이미지 파일 외 등록했을 경우
function uploadOtherFile(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

const downloadFile = (req, res) => {};

module.exports = {
  s3: s3,
  storage: storage,
  upload: upload,
  uploadSingleFile: uploadSingleFile,
  downloadFile,
};
