const express = require("express");
const multer = require("multer");
const fs = require("fs");

const path = require("path");

const router = express.Router();

// const storage = multer.diskStorage({
//     destination: (req,file, callback) => {
//         const dir = './uploads';

//         if(!fs.existsSync(dir)) {
//             fs.mkdirSync(dir);
//         }
//         callback(null, dir);
//     },
//     filename: (req, file, callback) => {
//         callback(null,file.originalname);
//     }
// });

// var upload = multer({storage: storage}).array('files', 12);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });

// Upload 기본 페이지 (GET)
router.get("", (req, res) => {
  res.render("index");
});

// Single File Upload
// router.post("", upload.single("files"), (req, res, next) => {
//   var fileinfo = req.file;
//   var title = req.body.title;
//   console.log(title);
//   res.send(fileinfo);
// });
// Single File Upload

router.post("/", upload.array("multi-files"), (req, res) => {
  //   res.redirect("/");
  res.send(req.files);
});

// router.post('', (req, res, next) => {
//     upload(req, res, function(err) {
//         if(err) {
//             return res.send(err);
//         }
//         res.send("UPLOAD COMPLETE");
//     })
// })

module.exports = router;
