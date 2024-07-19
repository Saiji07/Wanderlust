const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const {listingSchema,reviewSchema}=require("../schema.js");

const ExpressError=require("../utils/ExpessError.js");
const WrapAsync=require("../utils/WrapAsync.js");
const {isLoggedIn,isOwner}=require("../middleware.js");
const listingControler=require("../controlers/listings.js");


const multer  = require('multer')// multer is used to parse multipart/form-data of forms
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});


const listingValidation= (req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error)
        {
            let errMsg=error.details.map((el)=>el.message).join(",");
throw new ExpressError(400,errMsg);
        }
        else{
            console.log("hello");
            next();
        }
}

// all listings
router
.route("/")
.get(listingControler.index)//index route
.post(isLoggedIn,upload.single("listing[image]"),listingValidation,WrapAsync(listingControler.createListing));// Create listing
// .post(),(req,res)=>{res.send(req.file);});
    // new route form
    router.get("/new",isLoggedIn,listingControler.newRouteForm);
    
    router
    .route("/:id")
    .get(listingControler.showRoute) // show route
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),listingValidation,WrapAsync(listingControler.updateListing)) //update listing
    .delete(isLoggedIn,isOwner,listingControler.destroyListing); //delete listing

    //edit form 
    router.get("/:id/edit",isLoggedIn,isOwner, listingControler.editForm);
        module.exports=router;