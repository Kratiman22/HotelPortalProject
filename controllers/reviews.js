const Listing = require("../models/listing.js");
const Review = require("../models/review.js");



module.exports.review = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id); 
    if (!listing) {
        return res.status(404).send("Listing not found");
    }
    res.render("./listings/review", { listing }); 
};




module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        return res.status(404).send("Listing not found");
    }

    let newReview = new Review(req.body.reviews);
    Review.author = req.user;
    listing.reviews.push(newReview);
    console.log(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review added!");
   
    res.redirect(`/explore/${listing._id}`);
};



module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId} });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");

    res.redirect(`/explore/${id}`);
};