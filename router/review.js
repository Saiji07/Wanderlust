const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const {listingSchema,reviewSchema}=require("../schema.js");

const ExpressError=require("../utils/ExpessError.js");
const WrapAsync=require("../utils/WrapAsync.js");
const Review=require("../models/review.js");
const { isLoggedIn, isAuthor } = require("../middleware.js");
const reviewControler=require("../controlers/reviews.js");

const reviewValidation=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);

}
else{
    next();
}

}

//  delete review
router.delete("/:reviewId",isLoggedIn,isAuthor,WrapAsync(reviewControler.destroyReview));
    
    // post review
router.post("/",isLoggedIn,reviewValidation,WrapAsync(reviewControler.postReview));
module.exports=router;