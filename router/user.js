const express=require("express");
const router=express.Router();
const User=require("../models/user.js")
const passport=require("passport");
const {saveUrl} = require("../middleware.js");
const userControler=require("../controlers/users.js")
router
.route("/signup")
.get(userControler.signupForm) //signup form
.post(userControler.signup); //signup



//sign in page
router
.route("/signin")
.get(userControler.signinForm) //sign in form
.post(saveUrl,
    passport.authenticate("local",{ failureRedirect: '/signin' ,failureFlash:true}),
    userControler.signin
);

router.get("/logout",userControler.logout); //logout



module.exports=router;