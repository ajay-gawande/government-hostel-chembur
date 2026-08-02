
module.exports.isLoggedIn = (req, res, next) => {
  console.log("Auth check:", req.isAuthenticated());

  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}; 