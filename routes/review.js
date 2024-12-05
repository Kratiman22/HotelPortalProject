const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isReviewAuthor, validateReview} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


//Review Route
router.get("/", wrapAsync(reviewController.review));

//Reviews Add
router.post("/", isLoggedIn ,validateReview ,wrapAsync(reviewController.createReview));

// Review Delete
router.delete("/:reviewId", isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
