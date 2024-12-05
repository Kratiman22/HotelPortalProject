if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");

const listing = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const dburl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("Connected to DB!");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dburl);
}


const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET
      },
      touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    Cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUsr = req.user;
    next();
})

app.get("/search", (req, res) => {
    const query = req.query.query.toLowerCase();
  
    // Check if query is a valid number for price search
    const isNumberQuery = !isNaN(query); // Check if the query is numeric
    
    const searchConditions = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } }
      ]
    };
  
    // If the query is a number, also search the price field
    if (isNumberQuery) {
      searchConditions.$or.push({ price: parseFloat(query) });
    }
  
    Listing.find(searchConditions)
      .then(results => {
        res.render("./listings/searchResults", { results });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error occurred while searching");
      });
  });

app.use("/explore", listing);
app.use("/explore/:id/reviews", reviews);
app.use("/", user);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { statusCode=500, message="Something went wrong!" } = err;
    res.render("error.ejs", {message, statusCode});
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log(" Server is listening to Port: 8080");
});