if(process.env.NODE_ENV!="production")
{
    require('dotenv').config();
}

console.log(process.env.SECRET);
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride = require('method-override');
const multer  = require('multer')// multer is used to parse multipart/form-data of forms
const upload = multer({ dest: 'uploads/' })

const ejsMate=require("ejs-mate");//ejs mate is used to create bolieplates

const passport=require("passport");
const LocalStrategy=require("passport-local");

const {listingSchema,reviewSchema}=require("./schema.js"); // schema validation
const Review=require("./models/review.js");
const User=require("./models/user.js");
const listingRouter=require("./router/listing.js");
const reviewRouter=require("./router/review.js")
const userRouter=require("./router/user.js");


const session=require("express-session");
const MongoStore = require('connect-mongo');

const flash= require("connect-flash");

const dbURL=process.env.DB_URL;


const store=MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
secret:process.env.SECRET
    },
    touchAfter:24*3600,
    
});
store.on("error",()=>{
console.log("error in mongo session store",err);
});
const sessioninfo={
    store,
    secret:process.env.SECRET, 
    resave:false, 
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge: 7 * 24 * 60 * 60 *1000,
        httpOnly:true

    }
};
app.listen(8080,()=>{
    console.log("listening on 8080");
});
const ExpressError=require("./utils/ExpessError.js");
const WrapAsync=require("./utils/WrapAsync.js");
const { date } = require("joi");
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";





app.use(session(sessioninfo));
app.use(flash());

app.use(passport.initialize());

app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());
main()
.then(()=>{
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbURL);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}




app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);



app.use((req,res,next)=>{
res.locals.success= req.flash("success");
res.locals.error=req.flash("error");
res.locals.currUser=req.user;
next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.get("/",async(req,res)=>{
  const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});
// app.get("/", (req,res)=>{
//     res.send("working");
// });

// app.get("/testing",async (req,res)=>{
//     let sample=new Listing({
//         title:"My new Villa",
//         description:"By the Beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India"
//     });
//     // await sample.save();
//     res.send("Sucessfull");
// });

app.all("*",(req,res,next)=>{
next(new ExpressError(404,"page not found")
);
});

app.use((err,req,res,next)=>{
let {status=500, message="something went wrong"}=err;
res.status(status).render("listings/error.ejs",{err});
});