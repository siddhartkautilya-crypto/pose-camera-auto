const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const uploadDir = path.join(__dirname,"uploads");
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use(express.json({limit:"50mb"}));
app.use(express.static("public"));
app.post("/upload",(req,res)=>{
  const {image,index}=req.body;
  const data = image.replace(/^data:image\/png;base64,/,"");
  const filename = "photo_"+Date.now()+"_"+index+".png";
  fs.writeFileSync(path.join(uploadDir,filename),data,"base64");
  res.json({status:"ok"});
});
app.use("/photos",express.static(uploadDir));
app.listen(3000,()=>console.log("Server running at http://localhost:3000"));