const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
  },
  fileUrl: {
    type: String,
  },
  fileType: {
    type: String,
  },
  cloudinaryId: {
    type: String,
  },
  note: {
    type: String,
    maxlength: 100,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("File", fileSchema);
