const express = require("express");
const multer = require("multer");
const fs = require("fs");

const path = require("path");
const glob = require("glob");

const router = express.Router();

const directoryPath = path.join(__dirname, "../../uploads");

fs.readdir(directoryPath, function (err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  //listing all files using forEach
  files.forEach(function (file) {
    // Do whatever you want to do with the file
    console.log(file);
  });
});

var getDirectories = function (src, callback) {
  glob(src + "/**/*", callback);
};
let folderList = [];
const folder = getDirectories("uploads", function (err, res) {
  if (err) {
    console.log("Error", err);
  } else {
    folderList = res;
    console.log(folderList);
  }
});
router.get("", (req, res) => {
  try {
    if (!folderList.isEmpty()) {
      return res.json({
        ResultCode: 200,
        ResultMessage: folderList,
      });
    } else {
      return res.json({
        ResultCode: 400,
        ResultMessage: "NO DOWNLOAD FILE",
      });
    }
  } catch (err) {
    return res.json({
      ResultCode: 500,
      ResultMessage: err,
    });
  }
});

module.exports = router;
