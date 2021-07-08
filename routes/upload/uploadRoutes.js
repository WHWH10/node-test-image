const express = require("express");
const multer = require("multer");
const fs = require("fs");

const path = require("path");

const router = express.Router();

const formatDate = () => {
  const date = new Date();

  let month = date.getMonth() + 1 + "";
  let day = "" + date.getDate();
  let year = "" + date.getFullYear();

  if (month.length < 2) {
    month = "0" + month;
  }
  if (day.length < 2) {
    day = "0" + day;
  }

  return [year, month, day].join("-");
};

const day = formatDate();
const items = ["Single File", "Multiple Files"];

// Multer Storage 설정

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const dir = "./uploads";
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir);
//     }
//     cb(null, dir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + file.originalname);
//   },
// });

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const root = "./uploads";
    if (!fs.existsSync(root)) {
      if (file.mimetype.startsWith("image")) {
      }
    }
    cb(null, root);
    // if (file.mimetype === "image/png") cb(null, "uploads/img");
    // else if (file.mimetype === "text/plain") cb(null, "uploads/txt");
    // else cb(null, "uploads/etc");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + "-" + Date.now());
  },
});
var upload = multer({ storage: storage });
// Upload Get
router.get("", (req, res) => {
  res.render("upload/upload_main", { listTitle: day, newListItems: items });
});

// Single File Upload Get
router.get("/single", (req, res) => {
  res.render("upload/upload_single");
});

// Single File Upload Post
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

// Multiple File Upload Post
router.post("/multiple", upload.array("multiFiles"), (req, res) => {
  var fileinfo = req.files;
  res.send(fileinfo);
});

router.post("", (req, res) => {
  const multiFiles = req.files;
  const singleFile = req.file;

  try {
    switch (req) {
      case req.file:
        res.send("One file");
        break;
      case req.files:
        res.send("Multi Files");
        break;
      default:
        res.send("hk,,,bb");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Single and Multiple File Upload
// router.post("", upload.array("multi-files"), (req, res) => {
//   console.log(req.files);
//   res.send(req.files);
// });

// router.post("/", upload.array("multi-files"), (req, res) => {
//   //   res.redirect("/");
//   res.send(req.files);
// });

module.exports = router;
