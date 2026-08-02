const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");



// SAVE CONTACT FORM
router.post("/", async (req, res) => {

  console.log("Form submitted", req.body);
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).send("All required fields missing");
    }

    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    await newContact.save();

    // SUCCESS REDIRECT (you can change)
    req.flash("success", "Message sent successfully!");
    res.redirect("/home");

  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong!");
    res.redirect("/");
  }
});

module.exports = router;