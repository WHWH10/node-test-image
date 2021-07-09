const mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");

// Define Schemes
mongoose.set("useCreateIndex", true);

autoIncrement.initialize(mongoose.connection);
const octetStreamSchema = new mongoose.Schema(
  {
    // imageId: { type: Number, default: 0 },
    octetName: { type: String, required: true },
    octetUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

octetStreamSchema.plugin(autoIncrement.plugin, {
  model: "OctetStream",
  field: "octetId",
  startAt: 1,
  increment: 1, // 증가
});

// Create Model & Export
module.exports = mongoose.model("OctetStream", octetStreamSchema);
