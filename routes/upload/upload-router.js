const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const commonfuction = require("../../utils/common/function");

const router = express.Router();

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
    fileName = commonfuction.day + " - " + fileName[0] + "." + fileType;
    cb(null, fileName);
  },
});

var upload = multer({ storage: storage });

// Upload Main Page (LOCAL)
router.get("", (req, res) => {
  res.render("upload/upload_main", {
    listTitle: commonfuction.day,
    newListItems: commonfuction.uploadCategory,
  });
});

// Single File Upload Get
router.get("/single", (req, res) => {
  res.render("upload/upload_single");
});

router.post("/single", upload.single("single"), (req, res) => {
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
});

// Multiple File Upload Get
router.get("/multiple", (req, res) => {
  res.render("upload/upload_multi");
});

router.post("/multiple", upload.array("multiFiles"), (req, res) => {
  var fileinfo = req.files;
  res.send(fileinfo);
});

module.exports = router;
