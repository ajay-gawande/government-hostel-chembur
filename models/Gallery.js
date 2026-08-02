const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
    category:String,
    title:String,
    discription:String,
    image:[
        {
        type:{type:String},
        url:String,
        public_id:String,
        filename:String,
        width: Number,
        height: Number
    }]
});

module.exports = mongoose.model("Gallery", gallerySchema);