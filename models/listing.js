const mongoose=require("mongoose");
const review = require("./review");
const { ref } = require("joi");
const Schema=mongoose.Schema;
const defaultLink="https://i.pinimg.com/originals/93/71/02/9371022fe1725f93241044057aea7e34.jpg";
const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        url:String,
        filename:String
        // type:String,
        // default:defaultLink,
        // set:(v)=>v===""?defaultLink:v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
await review.deleteMany({id : {$in:listing.reviews}});
}
});
const Listing=mongoose.model("listing",listingSchema);
module.exports=Listing;