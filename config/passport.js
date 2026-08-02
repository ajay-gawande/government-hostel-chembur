const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Admin = require("../models/Admin");

passport.use(new LocalStrategy(
  async (username, password, done) => {

    const user = await Admin.findOne({ username });

    if (!user) return done(null, false);

    if (user.password !== password) {
      return done(null, false);
    }

    return done(null, user);
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await Admin.findById(id);
  done(null, user);
});

module.exports = passport;