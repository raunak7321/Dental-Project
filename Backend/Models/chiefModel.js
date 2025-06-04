const mongoose = require("mongoose");

const chiefSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  branchId: {
    type: String,
  },
});

module.exports = mongoose.model("Chief", chiefSchema);
