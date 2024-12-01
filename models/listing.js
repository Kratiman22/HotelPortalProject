const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");


const listingSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        default: "Description is not provided.",
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
        require: [true, "Price is required"],
        min: [0, "Price cannot be Negative"]
    },
    location: {
        type: String,
        require: [true, "Location is required"],
    },
    country: {
        type: String,
        require: [true, "Country is require"],
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});



listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});



const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;




// IMAGE LINK BACKUP
// type: {
        //     filename: {type: String},
        //     url: {type: String},
        // },
        // default:{
        //     filename: "defaultimage",
        //     url: "https://images.unsplash.com/photo-1573320180154-f7cd3a33e6a8?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // },
        // set: (value) => {
        //     //If the value is empty then default.
        //     if (!value || Object.keys(value).length === 0) {
        //         return {
        //             filename: "defaultimage",
        //             url: "https://images.unsplash.com/photo-1573320180154-f7cd3a33e6a8?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        //         };
        //     }
    
        //     // requirement only.
        //     return {
        //         filename: value.filename || "defaultimage",
        //         url:
        //             value.url ||
        //             "https://images.unsplash.com/photo-1573320180154-f7cd3a33e6a8?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        //     };
        // },