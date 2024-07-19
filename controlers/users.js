const User=require("../models/user.js")
module.exports.signupForm=async(req,res)=>{
    res.render("user/signup.ejs");
    };
    module.exports.signup=async(req,res,next)=>{
        try{
            let{username,email,password}=req.body;
            const newUser=new User({username,email});
            const registeredUser= await User.register(newUser,password);
         
            req.login(newUser,(err)=>{
                if(err){
    return next(err);
                }
                req.flash("success","Welcome to Wonderlust!");
                res.redirect("/listings");
            })
        }
        catch(e)
        {
    req.flash("error",e.message);
    res.redirect("/signup");
        }
    
    };
    module.exports.signinForm=(req,res)=>{

        res.render("user/signin.ejs");
        };
        module.exports.signin=async(req,res)=>{
            req.flash("success","Welcome To Wonderlust");
            let redUrl= res.locals.renderurl|| "/listings";
            res.redirect(redUrl);
            
            };
    module.exports.logout=(req,res)=>{
        req.logout((err)=>{
            if(err)
            { 
                return next(err);
            }
            else{
                req.flash("success","You Are Logged Out!");
                res.redirect("/listings");
            }
        })
    }