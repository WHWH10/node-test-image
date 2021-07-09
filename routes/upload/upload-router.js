const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const commonFc = require("../../utils/common/function");
const uploadController = require("../../controllers/upload/upload-controller");

const router = express.Router();

// Upload Main Page (LOCAL)
router.get("", (req, res) => {
  res.render("upload/upload_main", {
    listTitle: commonFc.day,
    newListItems: commonFc.uploadCategory,
  });
});

// Single File Upload Get
router.get("/single", (req, res) => {
  res.render("upload/upload_single");
});

router.post("/single", uploadController.upload.single("single"), (req, res) => {
  uploadController.uploadSingleFile(req, res);
});

// Multiple File Upload Get
router.get("/multiple", (req, res) => {
  res.render("upload/upload_multi");
});

router.post(
  "/multiple",
  uploadController.upload.array("multiFiles"),
  (req, res) => {
    uploadController.uploadMultiFile(req, res);
  }
);

module.exports = router;
