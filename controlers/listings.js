const Listing=require("../models/listing.js");
const maptoken=process.env.MAP_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const geocodingClient = mbxGeocoding({ accessToken: maptoken });

module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    };

    module.exports.newRouteForm=(req,res)=>{
        res.render("listings/new.ejs");
    };
    module.exports.showRoute=async (req,res)=>{
        let{id}=req.params;
        const listing=await Listing.findById(id).populate({path:"reviews",
            populate:{path:"author"}
        }).populate("owner");
        if(!listing)
        {
            req.flash("error","Listing Does Not Exist");
            res.redirect("/listings");
        }
        res.render("listings/show.ejs",{listing});
        };

 module.exports.createListing=async (req,res)=>{
   let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send(); 
    const newListing=new Listing(req.body.listing);
  newListing.owner=req.user._id;
  let url=req.file.path;
  let filename=req.file.filename;
  newListing.image={url,filename};
  newListing.geometry=response.body.features[0].geometry;
    let newListing1=await newListing.save();
    console.log(newListing1);
    req.flash("success","New Listing Added");
    res.redirect("/listings");
    };

module.exports.editForm=async (req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing)
        {
            req.flash("error","Listing Does Not Exist");
            res.redirect("/listings");
        }

        let origninalUrl=listing.image.url;
        origninalUrl=origninalUrl.replace("/upload","/upload/h_300,w_250");

    res.render("listings/edit.ejs",{listing,origninalUrl});
    };
    module.exports.updateListing=async(req,res)=>{
        let{id}=req.params;
       let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});

       let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send(); 

       listing.geometry=response.body.features[0].geometry;
    let upListing=await listing.save();
       if(typeof req.file !=="undefined")
       {
        let url=req.file.path;
        let filename=req.file.filename;
       upListing.image={url,filename};
        await upListing.save();
       }
     
        res.redirect(`/listings/${id}`);
        };

        module.exports.destroyListing=async (req,res)=>{
            let {id}=req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
        };