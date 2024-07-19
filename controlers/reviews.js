const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
    
    };

    module.exports.postReview=async(req,res)=>{
        let listing= await Listing.findById(req.params.id);
        let newReview=new Review(req.body.review);
        newReview.author=res.locals.currUser._id;
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        console.log(newReview);
        res.redirect(`/listings/${listing._id}`);
        };