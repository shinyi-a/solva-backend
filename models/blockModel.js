const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blockSchema = new Schema(
  {
    postalcode: {
      type: String,
      required: true,
      minLength: 6,
      maxLenght: 6,
      unique: true,
    },
    capacity_kwp: {
      type: String,
      // required: true,
    },
    panels: Number,
    panelkwp: Number,
    status: String,
    projectmanager: String,
    email: String,
    pendingdate: Date,
    constructiondate: Date,
    tncdate: Date,
    turnondate: Date,
    tncreport_doc: String,
    asbulit_doc: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Block", blockSchema);
