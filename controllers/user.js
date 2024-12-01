const User = require('../models/user.js');

module.exports.renderSignup = async(req, res) => {
    try{

        let{ username, email, password } = req.body;
        const newUser = new User({email, username});
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "User register successfully!");
            res.redirect("/explore");
        });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};



module.exports.renderLogin = (req, res) => {
    res.render("./users/login.ejs");
};



module.exports.login = async(req,res) => {
    req.flash("success", "Welcome back! You are logged in.");
    let redirectUrl = res.locals.redirectUrl || "/explore";
    res.redirect(redirectUrl);
};



module.exports.renderLogout = (req, res, next) =>{
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/explore");
    });
};