const express=require("express");
const fs=require("fs");
const path=require("path");

const app=express();
app.use(express.json({limit:"50mb"}));
app.use(express.static("public"));

const uploadDir=path.join(__dirname,"uploads");

app.post("/upload",(req,res)=>{
 const {image,index}=req.body;
 const data=image.replace(/^data:image\/png;base64,/,"");
 const filename="photo_"+Date.now()+"_"+index+".png";
 fs.writeFileSync(path.join(uploadDir,filename),data,"base64");
 res.json({status:"ok"});
});

app.get("/list",(req,res)=>{
 const files=fs.readdirSync(uploadDir);
 res.json(files);
});

app.use("/photos",express.static(uploadDir));

app.listen(3000,()=>console.log("Running at http://localhost:3000"));
