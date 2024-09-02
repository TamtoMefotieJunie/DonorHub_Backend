const mongoose = require("mongoose");
require('dotenv').config();

const dbUrl = process.env.DB;
mongoose.connect(dbUrl,{})
.then(()=>{
    console.log("connected to database successfully");
})
.catch(()=>{
    console.log(error);
        console.log("could not connect to database");
})
