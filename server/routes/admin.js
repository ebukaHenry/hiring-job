const express=require("express");
const router=express.Router();
const jwt=require("jsonwebtoken");
const pool=require("../db");
const verifyToken = require("../middleware/auth");

router.post("/", verifyToken, async(req, res)=>{
    const {title, description, company_name, location, job_type, salary_range,} = req.body;
    try {
        if(req.user.role !=="merchant"){
           return res.status(401).json({message: "Unathorized access!"});
        }
        const result= await pool.query("INSERT INTO public.jobs (title, description, company_name, location, job_type, salary_range) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
            [title, description, company_name, location, job_type, salary_range]);
            res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Server error",error.message);
        res.status(500).json({message:"Server error!"});
    }
});

module.exports=router;