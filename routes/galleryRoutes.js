const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const upload = require("../middleware/multer.js")
const wrapAsync = require("../utils/wrapAsync");
const { model } = require("mongoose");
const cloudinary = require("cloudinary").v2;
const Gallery = require("../models/Gallery")

// show admin gallery page
router.get("/admin/gallery",  isLoggedIn, wrapAsync(async(req,res) =>{
    const gallery = await Gallery.find();

  
  res.render("admin/gallery/index.ejs",{gallery});
}));

// add image router
router.get("/admin/gallery/addImage", isLoggedIn, wrapAsync(async(req,res) =>{
    res.render("admin/gallery/addImage.ejs");
}));

router.post("/admin/gallery", isLoggedIn, upload.array("image",60), wrapAsync(async(req,res) =>{
    console.log(req.body);
    
    const {category, title, discription} = req.body;
    const files = req.files || [];
    

    console.log(req.files[0]);
    const imageData = files.map(file =>({
        type: file.mimetype.startsWith("image") ? "image" : "videod",
        url: file.path,
        public_id: file.filename,
        filename: file.originalname.split(".")[0],
       

    }));


    await Gallery.create({
        category,
        title,
        discription,
        image:imageData
    })
    res.redirect("/admin/gallery");
}));

// gallery edit form show

router.get("/admin/gallery/edit/:id", isLoggedIn, wrapAsync(async(req,res) =>{
    const { id } = req.params;
    const gallery = await Gallery.findById(id);
    
    
     if (!gallery) {
       req.flash("error", "Gallery not found");
       return res.redirect("/admin/gallery");
     }
   
     res.render("admin/gallery/editImage.ejs", { gallery });
}));


// update gallery

router.put("/admin/gallery/edit/:id", isLoggedIn, upload.array("image",20),wrapAsync(async(req,res) =>{

    const { id } = req.params;
    const { title, discription, image } = req.body
    const gallery = await Gallery.findById(id);
    
    if(!gallery){
        req.flash("error", "Gallery not Found");
        res.redirect("/admin/gallery");
    }

    
   
    
    const files = req.files || [];

    const newImage = files.map(file =>({
        type: file.mimetype.startsWith("image") ? "image" : "video",
        url: file.path,
        public_id: file.filename,
        filename: file.originalname

    }));

    gallery.title = title;
    gallery.discription = discription;
    gallery.image.push(...newImage);

    await gallery.save()

    req.flash("success", "gallery upadeted");
    res.redirect("/admin/gallery");
}))


// // image delete router 
router.delete("/admin/gallery/delete-image/:id/:index", isLoggedIn, wrapAsync(async(req,res) =>{
    const {id, index} = req.params
    const gallery = await Gallery.findById(id);

    if(!gallery){
        req.flash("error","gallery not found");
        res.redirect("/admin/gallery/edit/:id");
    }



    const image = gallery.image[index];

    await cloudinary.uploader.destroy(image.public_id);

    gallery.image.splice(index,1);

    gallery.save();

    req.flash("success", "Image deleted")
    res.redirect("/admin/gallery")
}))

module.exports = router;

