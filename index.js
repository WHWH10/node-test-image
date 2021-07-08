const express = require("express");
const ejs = require("ejs");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();

// ROUTER 설정
// const uploadRouter = require("./routes/uploadRouter");
// const uploadRouter = require("./routes/upload/uploadRoutes");
const uploadRouter = require("./routes/upload/upload-router");
const nstorageRouter = require("./routes/nstorage/nstorageRouter");
const downloadRouter = require("./routes/download/download-router");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/views"));

app.set("view engine", "ejs");

// app.set("views", path.join(__dirname, "views"));

// Upload Router
app.use("/upload", uploadRouter);
app.use("/nstorage", nstorageRouter);
app.use("/download", downloadRouter);

app.get("/", (req, res) => {
  res.json({
    ResultCode: 200,
    ResultMessage: "MAIN PAGE",
  });
});

app.listen(process.env.PORT, (req, res) => {
  console.log(`Listening at Prot :: ${process.env.PORT}`);
});
