const { equal } = require("joi");
const Listing = require("./models/listing.js");
const Review=require("./models/review.js")

module.exports.isLoggedIn= (req,res,next)=>{
if(!req.isAuthenticated())
{  console.log(req.originalUrl);
    req.session.renderurl=req.originalUrl;
console.log(req.session.redirectUrl);
req.flash("error","You Are Not Logged In");
return res.redirect("/signin");
}
next();
};

module.exports.saveUrl=(req,res,next)=>{
    console.log(req.session.renderurl);
    if(req.session.renderurl){  res.locals.renderurl=req.session.renderurl;
         console.log(res.locals.renderurl);
    }
  
   
    next();
};

module.exports.isOwner=async (req,res,next)=>{

    let{id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id))
    {
        req.flash("error","You are not Owner of This Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports.isAuthor= async (req,res,next)=>{
let{id,reviewId}=req.params;

let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id))
    {
        req.flash("error","You are not Author Of This Review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};