require('dotenv').config();
const mongoose=require("mongoose");
const dbURL=process.env.DB_URL;
const MONGO_URL=dbURL;
const initData=require("./data.js");
const Listing=require("../models/listing.js")
main()
.then(()=>{
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const initDB=async()=>{
await Listing.deleteMany({});
initData.data=initData.data.map((obj)=>({...obj,owner:"6699220da01e41f7f0cbcc4f"}));
await Listing.insertMany(initData.data);
}
initDB();