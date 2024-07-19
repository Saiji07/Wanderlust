const mongoose=require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
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
initData.data=initData.data.map((obj)=>({...obj,owner:"668e9dbb305b7deae0dfc843"}));
await Listing.insertMany(initData.data);
}
initDB();