const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../Schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listing.js");



const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        // console.log(error);
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};



router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn, 
        upload.single("listing[image]"),
        validateListing, 
        wrapAsync(listingController.createListing)
    );

// New Route
router.get("/new", isLoggedIn ,listingController.renderNewForm
);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing))
    .delete(isLoggedIn ,wrapAsync(listingController.destroyListing));


// Edit Route
router.get("/:id/edit", isLoggedIn ,wrapAsync(listingController.editListing));

module.exports = router;