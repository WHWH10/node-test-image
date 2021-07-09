const express = require("express");
const ejs = require("ejs");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

// require("dotenv").config();

if (process.env.NODE_ENV === "production") {
  require("dotenv").config({ path: path.join(__dirname, "./.env") });
  console.log("production mode");
  console.log(process.env.PORT);
} else {
  // dotenv.config({ path: path.join('/env', './local.env')});
  require("dotenv").config({ path: path.join(__dirname, "./.env.dev") });
  console.log("development mode");
  console.log(process.env.PORT);
}

const app = express();

// ROUTER 설정
const uploadRouter = require("./routes/upload/upload-router");
const nstorageRouter = require("./routes/nstorage/nstorage-router");
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

// CONNECT TO MONGODB SERVER
console.log(process.env.MONGO_URL);

app.get("/", (req, res) => {
  res.json({
    ResultCode: 200,
    ResultMessage: "MAIN PAGE",
  });
});

app.listen(process.env.PORT, (req, res) => {
  console.log(`Listening at Prot :: ${process.env.PORT}`);
});
