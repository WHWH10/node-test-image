const mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");

// Define Schemes
mongoose.set("useCreateIndex", true);

autoIncrement.initialize(mongoose.connection);
const imageSchema = new mongoose.Schema(
  {
    // imageId: { type: Number, default: 0 },
    imageName: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

imageSchema.plugin(autoIncrement.plugin, {
  model: "Image",
  field: "imageId",
  startAt: 1,
  increment: 1, // 증가
});

// Create Model & Export
module.exports = mongoose.model("Image", imageSchema);
