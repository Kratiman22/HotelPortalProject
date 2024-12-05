const { response } = require("express");
const Listing = require("../models/listing.js")
const fetch = require("node-fetch");

module.exports.index = async (req, res) => {
    const allData = await Listing.find({});
    res.render("./listings/index.ejs", { allData });
};

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id)
    .populate({
        path: "reviews", 
        populate:{
            path: "author"
        },
    }).populate("owner");
    if(!listing){
        req.flash("error", "Data is not exist!");
        res.redirect("/explore");
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
};



module.exports.createListing = async (req, res, next) => {
    try {
        const apiKey = process.env.GEOAPIFY_API_MAP;
        const address = req.body.listing.location;
        const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${apiKey}`;

        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();

        // Use safe access with optional chaining and default coordinates
        const coordinates = geocodeData.features?.[0]?.geometry?.coordinates || [0, 0];

        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.geometry = { type: "Point", coordinates }; // Always define geometry
        newListing.owner = req.user._id;
        newListing.image = { url, filename };

        const savedListing = await newListing.save();
        console.log(savedListing);

        req.flash("success", "New Data Added Successfully!");
        res.redirect("/explore");
    } catch (err) {
        console.error("Error creating listing:", err.message);
        next(err);
    }
};
module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Data is not exist!");
        res.redirect("/explore");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs", { listing, originalImageUrl });
};


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    // let listing = await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currUsr._id)){
    //     req.flash("error", "You don't have permission to edit");
    //     return res.redirect(`/explore/${id}`);
    // }
    let listings = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listings.image = {url, filename};
        await listings.save();
    }
    req.flash("success", "Data Updated Successfully!");
    res.redirect(`/explore/${id}`);

};


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deleteData = await Listing.findByIdAndDelete(id);
    console.log(deleteData);
    req.flash("success", "Data Deleted Successfully!");
    res.redirect("/explore");
};