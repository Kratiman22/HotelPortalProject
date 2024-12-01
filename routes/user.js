const express = require("express");
const { route } = require("./listing");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

router
    .route("/signup")
    .get((req, res) => {
        res.render("./users/signup.ejs");
    })
    .post(wrapAsync(userController.renderSignup));

router
    .route("/login")
    .get(userController.renderLogin)
    .post(saveRedirectUrl ,passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.login);

router.get("/logout", userController.renderLogout);

module.exports = router;