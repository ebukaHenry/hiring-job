const express=require("express");
const router=express.Router();
const jwt=require("jsonwebtoken");
const pool=require("../db");
const verifyToken = require("../middleware/auth");

router.get("/", verifyToken, async(req, res)=>{
    if(req.user.role !=="merchant"){
        return res.status(403).json({message:"Access denied!"});
    }
    try {
        const result=await pool.query("SELECT id, full_name, email, cv FROM public.users WHERE role='user'");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching applicants:",error.message);
        res.status(500).json({message:"Error fetching applicants"});
    }
});

module.exports=router;