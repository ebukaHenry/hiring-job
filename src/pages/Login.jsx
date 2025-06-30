import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Login() {

    const {login} = useContext(AuthContext);
    const navigate=useNavigate();

    const[error, setError] = useState("");
    const [formData, setFormData] = useState({
        email:"",
        password:"",
    });

    const handleChange = (e)=>{
        setFormData((formData)=>({
            ...formData,
            [e.target.name]:e.target.value,
        }));
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setError("");
        try {
            const res= await axios.post("https://job-hiring-backend-1.onrender.com/api/auth/login", formData);
            if (!res.data || !res.data.token) {
            throw new Error("Invalid response from server");
            }
            const token=res.data.token;
            login(token);

            const user=jwtDecode(token);
            if(user.role==="merchant"){
                navigate("/admin");
            }else{
                navigate("/dashboard");
            }
            
        } catch (error) {
            console.error("Login failed",error.message)
            setError("Login failed!");
            
        }
    }

    return(
        <div>
            <Navbar />
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input type="text" name="email" value={formData.email} placeholder="Email" onChange={handleChange} required/>
                <input type="password" name="password" value={formData.password} placeholder="Password" onChange={handleChange} required/>
                <button type="submit">Login</button>
                <p>Don't have an account? <Link to="/register" className="no-link-style">Register</Link></p>
                {error && <p style={{color: "red"}}>{error }</p>}
            </form>
            
        </div>
    </div>);
    
}

export default Login;