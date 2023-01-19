const express = require("express");
require("dotenv").config()

const app = express();

const PORT = process.env.PORT || 3000

app.get("/",(req,res)=>{
    res.send("Hello")
})

app.listen(PORT,async () =>{
    console.log(`listening on port${PORT}`)
})