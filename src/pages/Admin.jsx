import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { jwtDecode } from "jwt-decode";
const API = process.env.REACT_APP_API_URL;

function Admin() {

    const {token} = useContext(AuthContext);
    const user = token ? jwtDecode(token) : null;
    console.log(user);
    
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [applicants, setApplicants] = useState([]);
    const [isExtended, setIsExtended] = useState(false);
    const [jobDescription, setJobDescription] = useState({
        title:"",
        description:"",
        company_name:"",
        location:"",
        job_type:"",
        salary_range:"",
    });

    const clicked =()=>{
        setIsExtended(true);
    }

    const handleChange= async(e)=>{
        setJobDescription((jobDescription)=>({
            ...jobDescription,
            [e.target.name]:e.target.value,
        })
    );
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setError("");
        try {
            const token=localStorage.getItem("token");
            if(!token){
                setError("Not authorized!");
            }
            if(user?.role !=="merchant"){
                setError("Unathorized user!");
            }
            const res= await axios.post("https://job-hiring-backend-1.onrender.com/api/admin", jobDescription,{
                headers:{Authorization: `Bearer ${token}`}
            });
            console.log("Successful", res.data);
            setSuccess("Job posted successfully");
            setJobDescription({
            title:"",
            description:"",
            company_name:"",
            location:"",
            job_type:"",
            salary_range:"",});
        } catch (error) {
            console.error("Something went wrong.",error.message);
            setError("Post request failed!");
        }
    }

    useEffect(()=>{
        const fetchApplicants=async()=>{
            const token=localStorage.getItem("token");
            try {
                const res= await axios.get(`${API}/api/applicants`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                setApplicants(res.data);
            } catch (error) {
                console.error("Failed to fetch applicants",error.message);
            }
        };
        if(token){
            fetchApplicants();
        }
        
    },[]);

    return(
        <div>
            <Navbar />
        <section>
        <div className="admin-page">
            <div className="admin-sidebar">
                <h2>Merchant Info</h2>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Name:</strong> {user.full_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
            <div className="admin-content">
            <form className="admin-form" type="subbmit" onSubmit={handleSubmit}>
                <h4>Create job</h4>
                <input type="text" name="title" placeholder="Job title" value={jobDescription.title} onChange={handleChange} />
                <input type="text" name="company_name" placeholder="Company name" onClick={clicked} rows={isExtended?20:1} value={jobDescription.company_name} onChange={handleChange} />
                <input type="text" name="location" placeholder="Location" value={jobDescription.location} onChange={handleChange} />
                <input type="text" name="job_type" placeholder="Job type" value={jobDescription.job_type} onChange={handleChange} />
                <input type="text" name="salary_range" placeholder="Salary" value={jobDescription.salary_range} onChange={handleChange} />
                <textarea type="text" name="description" placeholder="Job description" value={jobDescription.description} onChange={handleChange}/>
                <button type="submit">Post Job</button>
                {success && <p style={{color: "green"}}>{success}</p>}
                {error && <p style={{color: "red"}}>{error}</p>}
            </form>
            </div>
        </div>
        </section>
        <section>
            <h2>Applicants:</h2>
            {applicants.length ===0 ? <p>No applicants found</p> : (
            applicants.map((applicant)=>(
                <div className="applicant-card" key={applicant.id}>
                    <p>{applicant.full_name}</p>
                    <p>{applicant.email}</p>
                    {applicant.cv && (
                        <a href={`http://localhost:8080/uploads/${applicant.cv}`} target="_blank" rel="noopener noreferrer">
                            View CV
                        </a>
                    )}
                </div>
            ))
            ) }
        </section>
        </div>
    );
    
}

export default Admin;