const express = require("express");
const nstorageController = require("../../controllers/nstorage/nstorage-controller");
const commonFc = require("../../utils/common/function");

const router = express.Router();

router.get("", (req, res) => {
  res.render("nstorage/nstorage_main", {
    listTitle: commonFc.day,
  });
});

router.get("/upload/single", (req, res) => {
  res.render("nstorage/nstorage_single");
});

router.post(
  "/upload/single",
  nstorageController.upload.single("single"),
  (req, res) => {
    nstorageController.uploadSingleFile(req, res);
  }
);

router.get("/upload/multiple", (req, res) => {
  res.render("nstorage/nstorage_multi");
});

router.get("/downloadFile", (req, res) => {
  nstorageController.downloadFile(req, res);
});

module.exports = router;
