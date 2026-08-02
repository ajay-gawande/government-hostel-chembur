const express = require("express");
const router = express.Router();
const passport = require("passport");

// Login page
router.get("/login", (req, res) => {
  res.render("admin/login.ejs");
});

// Login submit
router.post("/login",
  passport.authenticate("local", {
    successRedirect: "/admin/home",
    failureRedirect: "/login"
  })
);

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/login");
  });
});

module.exports = router;