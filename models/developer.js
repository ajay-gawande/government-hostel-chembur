const mongoose = require("mongoose");

const developerSchema = new mongoose.Schema({
  name: String,
  email: String,
  whatsapp: String,
  instagram: String,
  telegram: String,
  linkedin: String,
  own: String,
  image:{
      type: { type: String },
      url: String,
      public_id: String,
      filename: String
    }
  
});

module.exports = mongoose.model("Developer", developerSchema);