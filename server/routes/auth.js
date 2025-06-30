const express=require("express");
const router=express.Router();
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const pool=require("../db");

router.post("/register", async(req, res)=>{
    const {role, full_name, email, password, confirmPassword} = req.body;
    try {
        if(!role){
            return res.status(401).json({message: "Kindly select a role."})
        }
        if(password !==confirmPassword){
            return res.status(400).json({message: "Password mismatch"});
        }
        const existing= await pool.query("SELECT * FROM public.users WHERE email= $1", [email]);
        if(existing.rows.length>0){
            return res.status(409).json({message: "User already exist!"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query("INSERT INTO public.users (full_name, role, email, password) VALUES ($1,$2,$3,$4) RETURNING id, full_name, role, email",
            [full_name, role, email, hashedPassword]);
        const user=newUser.rows[0];
        const token=jwt.sign(
            {id:user.id, full_name:user.full_name, role:user.role, email:user.email,},
            process.env.JWT_SECRET,
            {expiresIn: "1h"});
        res.json({
            token,
            user:{id:user.id, full_name:user.full_name, role:user.role, email:user.email}});
    } catch (error) {
        console.error("Registration error", error.message);
        res.status(500).json({message: "Server error"})
    }
    
});

router.post("/login", async(req, res)=>{
    const {email, password} = req.body;
    try {
    const userResult = await pool.query("SELECT * FROM public.users WHERE email=$1", [email]);
    if(userResult.rows.length===0){
        return res.status(401).json({message: "Invalid credentials"});
    }
    const user=userResult.rows[0];
    const validPassword=await bcrypt.compare(password, user.password);
    if(!validPassword){
        return res.status(401).json({message: "Invalid credentials"});
    }
    const token=jwt.sign({id:user.id, email:user.email, role:user.role, full_name:user.full_name},
        process.env.JWT_SECRET, {expiresIn: "1h"}
    );
    res.json({token, user:{id:user.id, email:user.email, role:user.role, full_name:user.full_name}});
} catch (error) {
    console.error("Login error",error.message);
    res.status(500).json({message:"Server error"})
    }

}); 

module.exports = router;