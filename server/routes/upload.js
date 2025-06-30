const express=require("express");
const multer=require("multer");
const router=express.Router();
const jwt=require("jsonwebtoken");
const verifyToken = require("../middleware/auth");
const pool=require("../db");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage=multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, "uploads/");
    },
    filename: function (req,file,cb) {
        const ext=file.originalname.split(".").pop();
        cb(null, `${Date.now()}.${ext}`);
    },
});

const upload=multer({storage: storage});

router.post("/upload-cv",verifyToken,upload.single("cv"), async(req, res)=>{
    if(!req.file){
        res.status(400).json({message:"No file uploaded"});
    }
    const filename=req.file.filename;
    const userId=req.user.id;
    try {
        await pool.query("UPDATE public.users SET cv =$1 WHERE id =$2", [req.file.filename, req.user.userId]);
        res.status(200).json({message:"Cv uploaded!", file: filename});
    } catch (error) {
        console.error("Error saving CV to DB",error.message);
        res.status(500).json({message: "Server error saving CV to DB"});
    }
    
});

module.exports=router;