require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo");
const passport = require("./config/passport");
const clientRoutes = require("./routes/clientRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoute = require("./routes/contact");
const errorHandler = require("./middleware/error");
const galleryRouter = require("./routes/galleryRoutes");
const app = express();

mongoose.connect(process.env.MONGO_URL, {
  family: 4
})
.then(() => {
  console.log("DB connected ");

  app.listen(8080, () => {
    console.log("server start ");
  });
})
.catch(err => console.log("DB error:", err));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  crypto:{
    secret: process.env.SESSION_SECRET
  },
  touchAfter: 24 * 3600,
})


store.on("error",() =>{
  console.log("Error in MONGO SECSSION STORE",err);
});

app.use(session({
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: "sessions"
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));



app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});


app.use(passport.initialize());
app.use(passport.session());


app.use((req,res,next)=>{
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});


app.use("/", authRoutes);
app.use("/", clientRoutes);
app.use("/", galleryRouter);
app.use("/", adminRoutes);
app.use("/", contactRoute);



app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});


app.use(errorHandler);