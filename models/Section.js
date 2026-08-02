const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  page: String,
  section: String,
  title: String,
  subtitle: String,
  description: String,
  para1:String,
  para2:String,
  para3:String,
  para4:String,
  bold1:String,
  bold2:String,
  flag: String,
  media: [
    {
      type: { type: String },
      url: String,
      public_id: String,
      filename: String
    }
  ]
});

module.exports = mongoose.model("Section", sectionSchema);