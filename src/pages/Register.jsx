import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Register() {

    const navigate=useNavigate();
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        role: "",
        full_name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e)=>{
        setFormData((formData)=>(
       { ...formData,
    [e.target.name] : e.target.value})
    );
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setError("");
        if(formData.password !==formData.confirmPassword){
            setError("Password mismatch");
            return;
        }
        try {
            const response= await axios.post("https://job-hiring-backend-1.onrender.com/api/auth/register", formData);
            navigate("/login");
        } catch (error) {
            console.error("Registration failed", error.message);
            setError("Registration failed!");
            
        }

    }


    return(
        <div><Navbar />
        <div className="auth-container">
            
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Create an account</h2>
                <div>
                <label>
                <input type="radio" name="role" value="merchant" checked={formData.role==="merchant"} onChange={handleChange} />
                Merchant
                </label>
                <label>
                <input type="radio" name="role" value="agent" checked={formData.role==="agent"} onChange={handleChange} />
                Agent
                </label>
                </div>
                <input type="text" name="full_name" placeholder="Full name" value={formData.full_ame} onChange={handleChange} required/>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required/>
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required/>
                <input type="password" name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} required/>
                <button type="submit">Submit</button>
                <p>Already have an account? <Link to="/login" className="no-link-style">Login</Link></p>
                {error && <p style={{color: "red"}}>{error}</p>}
            </form>
            
        </div>
    </div>);
    
}

export default Register;