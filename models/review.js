const{string} = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    rating: {
        type: Number,
        require: true,
        min: 1,
        max:5,
    },
    comment: {
        type: String,
        require: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Review", reviewSchema);