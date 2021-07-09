const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const commonFc = require("../../utils/common/function");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let rootDir = "./uploads";
    let imageDir = "./uploads/image";
    let otherDir = "";
    if (file.mimetype.startsWith("image")) {
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
      }
      cb(null, imageDir);
    } else {
      otherDir = rootDir + "/" + file.mimetype;
      if (!fs.existsSync(otherDir)) {
        fs.mkdirSync(otherDir, { recursive: true });
      }
      cb(null, otherDir);
    }
  },
  filename: function (req, file, cb) {
    let fileName = file.originalname.split(".");
    let fileType = fileName[fileName.length - 1];
    fileName = commonFc.day + " - " + fileName[0] + "." + fileType;
    cb(null, fileName);
  },
});

var upload = multer({ storage: storage });

// Single File Upload
const uploadSingleFile = (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).send({
        ResultCode: 400,
        ResultMessage: "선택된 파일이 없습니다.",
      });
    } else {
      // send Response
      var fileInfo = req.file;
      res.send(fileInfo);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const uploadMultiFile = (req, res) => {
  // var fileinfo = req.files;
  // res.send(fileinfo);
  try {
    const file = req.files;
    if (!file) {
      res.status(400).send({
        ResultCode: 400,
        ResultMessage: "선택된 파일이 없습니다.",
      });
    } else {
      let data = [];

      // iterate over all photos
      file.map((f) =>
        data.push({
          name: f.originalname,
          mimetype: f.mimetype,
          size: f.size,
        })
      );

      res.send({
        status: true,
        message: "Photos are uploaded.",
        data: data,
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  storage: storage,
  upload: upload,
  uploadSingleFile: uploadSingleFile,
  uploadMultiFile: uploadMultiFile,
};
