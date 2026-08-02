module.exports = (err, req, res, next) => {

  const status = err.status || 500;

  const isDev = process.env.NODE_ENV === "development";

  if (status !== 404) {
    console.log("ERROR:", err);
  }

  let message;

  if (isDev) {
    message = err.message;
  } else {
    if (status === 404) {
      message = "Page Not Found";
    } else if (status === 400) {
      message = err.message;
    } else {
      message = "Something went wrong";
    }
  }

  // HANDLE FILE SIZE ERROR (IMPORTANT)
  if (err.code === "LIMIT_FILE_SIZE" || (err.message && err.message.includes("File size too large"))) {
    req.flash("error", "File must be under 10MB");
    return res.redirect(req.get("Referrer") || "/admin");
  }

  // FOR ADMIN → USE FLASH + REDIRECT
  if (req.originalUrl.startsWith("/admin")) {
    req.flash("error", message);
    return res.redirect(req.get("Referrer") || "/admin");
  }

  //  CLIENT SIDE → KEEP RENDER
  return res.status(status).render("client/error", { status, message });
};