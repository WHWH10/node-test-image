const Image = require("../../models/image-model");
const OctetStream = require("../../models/octet-stream-model");
// const CsvStream = require("../../models/csv-model");
const fs = require("fs");
const commonFc = require("../../utils/common/function");
const mongoose = require("mongodb");
const csvtojsonV2 = require("csvtojson");

// Image URL Save to Mongodb(Naver Object Storage URL)
function saveToMongoImage(downloadUrl, file) {
  const image = new Image();
  image.imageName = file.originalname;
  image.imageUrl = downloadUrl;

  // Document instance method
  image.save(function (err) {
    if (err) {
      console.error(err);
      //   res.json({ result: 0 });
      return;
    }

    console.log("success");
    // res.json({ result: 1 });
  });
}

// OCTET URL SAVE to MONGODB
function saveToMongoOctet(file, downloadUrl) {
  const octet = new OctetStream();
  octet.octetName = file.originalname;
  octet.octetUrl = downloadUrl;

  octet.save(function (err) {
    if (err) {
      console.log(`octet error :: ${err}`);
      return;
    }
    console.log("OCtet Success");
  });
}

const saveToMongoCsv = async (file, downloadUrl) => {
  try {
    let list = await csvtojsonV2().fromString(file.buffer.toString());
    // convert to JSON
    var bodyJson = JSON.parse(JSON.stringify(list));
    console.log(bodyJson);
    bodyJson.push({ fileName: file.originalname });
    console.log(bodyJson);
    mongoose
      .connect(
        "mongodb+srv://admin:fISd2uhvcuZY0Pm3@mongodbtutorial.hlon7.mongodb.net/hyd-sample-data?retryWrites=true&w=majority",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          // useFindAndModify: false,
        }
      )
      .then((result) => {
        console.log("Successfully connected to mongodb");
        result
          .db("hyd-sample-data")
          .collection(file.originalname.split("-")[3])
          .insertMany(bodyJson, function (error, record) {
            if (error) throw error;
            console.log("data saved");
          });
      })
      .catch((e) => console.error(e));

    return list;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const saveToMongoOffice = (file, downloadUrl) => {
  // xlsx 파일일 경우
  if (file.originalname.includes("xlsx")) {
  }
};

const csvHeader = (file) => {
  const body = Buffer.from(file.buffer).toString("utf8");
  let content = [];
  body
    .trim()
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => {
      content.push(line);
    });
  let header = content[0].replace(/\s/g, "").split(",");
  console.log(header);

  return header;
};

module.exports = {
  saveToMongoImage: saveToMongoImage,
  saveToMongoOctet,
  saveToMongoOffice,
  saveToMongoCsv,
};
