const mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");

// Define Schemes
mongoose.set("useCreateIndex", true);

autoIncrement.initialize(mongoose.connection);
const header = ["userId", "test1", "test2", "Test3"];
const csvModelSchema = new mongoose.Schema({ timestamps: true });
for (let i = 0; i < header.length; i++) {
  csvModelSchema.add({header[i]: {type: string}});
}
// const csvModelSchema = new mongoose.Schema(
//   {
//     // imageId: { type: Number, default: 0 },
//     octetName: { type: String, required: true },
//     octetUrl: { type: String, required: true },
//   },
//   {
//     timestamps: true,
//   }
// );

csvModelSchema.plugin(autoIncrement.plugin, {
  model: "CsvStream",
  field: "csvId",
  startAt: 1,
  increment: 1, // 증가
});

// Create Model & Export
module.exports = mongoose.model("CsvStream", csvModelSchema);
