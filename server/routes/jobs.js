const express=require("express");
const router=express.Router();
const jwt=require("jsonwebtoken");
const pool=require("../db");
const verifyToken = require("../middleware/auth");

router.get("/",verifyToken,async(req, res)=>{
    try {
        const result= await pool.query("SELECT * FROM public.jobs ORDER BY id DESC");
        res.status(201).json(result.rows);
    } catch (error) {
        res.status(501).status({message:"Error fetching jobs"});
        console.error("An error occured",error.message);
        
    }
});

module.exports=router;