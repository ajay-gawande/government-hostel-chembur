const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const Section = require("../models/Section");
const upload = require("../middleware/multer.js")
const wrapAsync = require("../utils/wrapAsync");
const cloudinary = require("cloudinary").v2;
const Contact = require("../models/contact");
const Developer = require("../models/developer");

router.use((req, res, next) => {
  console.log("ADMIN ROUTE ACTIVE:", req.originalUrl);
  next();
});

const validPages = [ 
  "home",
  "about",
  "facilities",
  "events",
  "committees",
  "mess",
  "notices",

];

// GET ALL CONTACTS
router.get("/admin/contacts", isLoggedIn, wrapAsync(async (req, res) => {

  const contacts = await Contact.find().sort({ createdAt: -1 });

  res.render("admin/contacts.ejs", { contacts });

}));

// DELETE CONTACT
router.delete("/admin/contact/delete/:id", isLoggedIn, wrapAsync(async (req, res) => {

  const { id } = req.params;

  await Contact.findByIdAndDelete(id);

  req.flash("success", "Contact deleted");
  res.redirect("/admin/contacts");

}));


// DEVELOPER ROUTES

// show developer page
router.get("/admin/developer", isLoggedIn, wrapAsync(async (req, res) => {
  const developers = await Developer.find();
  res.render("admin/developer.ejs", { developers });
}));

// ADD FORM PAGE (🔥 YOU MISSED THIS)
router.get("/admin/developer/add", isLoggedIn, (req, res) => {
  res.render("admin/addDeveloper.ejs");
});

// SAVE
router.post(
  "/admin/developer",
  isLoggedIn,
  upload.single("image"),   // 👈 important
  wrapAsync(async (req, res) => {

    const { name, email, whatsapp, instagram, telegram, linkedin, own } = req.body;

    let imageData = {};

    if (req.file) {
      imageData = {
        url: req.file.path,
        public_id: req.file.filename,
        filename: req.file.originalname
      };
    }

    await Developer.create({
      name,
      email,
      whatsapp,
      instagram,
      telegram,
      linkedin,
      own,
      image: imageData
        
    });

    req.flash("success", "Developer added");
    res.redirect("/admin/developer");
  })
);

// EDIT FORM
router.get("/admin/developer/edit/:id", isLoggedIn, wrapAsync(async (req, res) => {
  const dev = await Developer.findById(req.params.id);
  res.render("admin/editDeveloper.ejs", { dev });
}));

// UPDATE
router.put(
  "/admin/developer/edit/:id",
  isLoggedIn,
  upload.single("image"),
  wrapAsync(async (req, res) => {

    const dev = await Developer.findById(req.params.id);

    const { name, email, whatsapp, instagram, telegram, linkedin,} = req.body;
    console.log(req.body);
    dev.name = name;
    dev.email = email;
    dev.whatsapp = whatsapp;
    dev.instagram = instagram;
    dev.telegram = telegram;
    dev.linkedin = linkedin;
  

    //  if new image uploaded
    if (req.file) {

      // delete old image
      if (dev.image?.public_id) {
        await cloudinary.uploader.destroy(dev.image.public_id);
      }

      dev.image = {
        url: req.file.path,
        public_id: req.file.filename,
        filename: req.file.originalname
      };
    }

    await dev.save();

    req.flash("success", "Developer updated");
    res.redirect("/admin/developer");
  })
);;

// DELETE
router.delete("/admin/developer/delete/:id", isLoggedIn, wrapAsync(async (req, res) => {

  const dev = await Developer.findById(req.params.id);

  // delete image from cloudinary
  if (dev.image?.public_id) {
    await cloudinary.uploader.destroy(dev.image.public_id);
  }

  await Developer.findByIdAndDelete(req.params.id);

  req.flash("success", "Developer deleted");
  res.redirect("/admin/developer");
}));



//  SHOW ADMIN PAGE

router.get("/admin/:page", isLoggedIn, wrapAsync(async (req, res) => {

  const page = req.params.page;
 

    //  CHECK VALID PAGE
  if (!validPages.includes(page)) {
    const err = new Error("Invalid Page");
    err.status = 404;
    throw err;
  }

  const sections = await Section.find({ page: page });
   
  res.render("admin/index.ejs", { page, sections });

}));

// OPEN ADD FORM
router.get("/admin/add-section/:page", isLoggedIn, (req, res) => {
  const page = req.params.page;
            
  res.render("admin/addSection.ejs", { page });
});


// SAVE DATA
router.post("/admin/add-section/:page", isLoggedIn, upload.array("media", 30), wrapAsync(async (req, res) => {

  const page = req.params.page;
  let section = req.body.section;

  const { title, subtitle, description, flag, customSection,para1,para2,para3,para4,bold1, bold2 } = req.body;

    if (section === "other") {
        section = customSection;
    }

    if (!section || section.trim() === "") {
      const err = new Error("Section is required");
      err.status = 400;
      throw err;
    }

  const singleSections = ["hero", "about"]; 

  //  CHECK SINGLE SECTION
  if (singleSections.includes(section)) {
    const existing = await Section.findOne({ page:page, section:section});

    if (existing) {
        req.flash("error", "Section already exists");
        return res.redirect(`/admin/${page}`);
      }
  }

  const files = req.files || [];

//  File size validation BEFORE processing

  const mediaData = files.map(file =>({
    type: file.mimetype.startsWith("image") ? "image" : "video",
    url: file.path,
    public_id: file.filename,
    filename: file.originalname.split(".")[0]
  }));

// SAVE IN DATABASE   
  await Section.create({
    page,
    section,
    title,
    subtitle,
    description,
    flag,
    para1,
    para2,
    para3,
    para4,
    bold1,
    bold2,
    media: mediaData
  });

  req.flash("success", "Section added successfully");
  res.redirect(`/admin/${page}`);
}));

// show edit form

router.get("/admin/edit/:id", isLoggedIn, wrapAsync(async (req, res) => {

  const { id } = req.params;

  const section = await Section.findById(id);

  if (!section) {
    req.flash("error", "Section not found");
    return res.redirect("/admin/home");
  }

  res.render("admin/editSection.ejs", { section });

}));


// update data

router.put(
  "/admin/edit/:id",
  isLoggedIn,
  upload.array("media", 30),
  wrapAsync(async (req, res) => {

    const { id } = req.params;
    const { title, subtitle, description,flag,para1,para2,para3,para4,bold1,bold2 } = req.body;

    const section = await Section.findById(id);

    if (!section) {
      req.flash("error", "Section not found");
      return res.redirect("/admin/home");
    }

    //  Update text
    section.title = title;
    section.subtitle = subtitle;
    section.description = description;
    section.para1 = para1,
    section.para2 = para2,
    section.para3 = para3,
    section.para4 = para4,
    section.bold1 = bold1,
    section.bold2 = bold2,
    section.flag = flag;

    //  Add new media
    const files = req.files || [];

    const newMedia = files.map(file => ({
      type: file.mimetype.startsWith("image") ? "image" : "video",
      url: file.path,
      public_id: file.filename,
      filename: file.originalname
    }));

    section.media.push(...newMedia);

    await section.save();

    req.flash("success", "Section updated");
    res.redirect(`/admin/${section.page}`);
  })
);



// media delete route
router.delete(
  "/admin/delete-media/:id/:index",
  isLoggedIn,
  wrapAsync(async (req, res) => {

    const { id, index } = req.params;

    const section = await Section.findById(id);

    if (!section) {
      req.flash("error", "Section not found");
      return res.redirect("/admin/home");
    }

    const media = section.media[index];

    //  Delete from Cloudinary
    await cloudinary.uploader.destroy(media.public_id);

    //  Remove from DB
    section.media.splice(index, 1);

    await section.save();

    req.flash("success", "Media deleted");
    res.redirect(`/admin/edit/${id}`);
  })
);


// delete section 

router.delete(
  "/admin/delete-section/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {

    const { id } = req.params;

    const section = await Section.findById(id);

    console.log(section);

    if (!section) {
      req.flash("error", "Section not found");
      return res.redirect("/admin/home");
    }

    // DELETE ALL MEDIA FROM CLOUDINARY
    for (let file of section.media) {
      if (file.public_id) {
        await cloudinary.uploader.destroy(file.public_id);
      }
    }

    // DELETE FROM DATABASE
    await Section.findByIdAndDelete(id);

    req.flash("success", "Section deleted successfully");

    res.redirect(`/admin/${section.page}`);
  })
);





module.exports = router;