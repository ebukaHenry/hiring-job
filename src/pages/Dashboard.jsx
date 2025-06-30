import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import CvUploads from "./CvUpload";

function Dashboard() {

    const {token} = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [search, setSearch] = useState("");
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);

    const handleSearch=(input)=>{
        setSearch(input);
    }

    useEffect(()=>{
        //const token = localStorage.getItem("token");
        if(token){
            try {
                const decoded=jwtDecode(token);
                setUser(decoded);
            } catch (error) {
                console.error("Invalid token");
                setUser(null);
            }
            fetchjobs();
        } else {
            setUser(null);
        }
    },[token]);

    const fetchjobs=async()=>{
        const res= await axios.get("https://job-hiring-backend.onrender.com/api/jobs",{
            headers:{Authorization: `Bearer ${token}`}
        });
        setJobs(res.data);
    }

    useEffect(()=>{
        let filteredJobs=[...jobs];
        if(search){
            filteredJobs=filteredJobs.filter(job=>job.title.toLowerCase().includes(search.toLowerCase()));
        }
        setFilteredJobs(filteredJobs);
    },[search,jobs]);

    return(
        <div className="">
            
            
            <Navbar onSearch={handleSearch} />
            <div className="page-container">
            {user && (
            <div className="user-info">
                <div className="top">
                    <p className="name">Welcome, {user.full_name}</p>
                    <img className="circle-img" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBgCPQmyPHrOWxnUvbmQIRwOipjW8woZUreA&s" alt="" />
                </div>
                <div className="bottom">
                    <p className="info">{user.email}</p>
                </div>
            </div>)}

            <div className="job-card">
            {filteredJobs.map(job=>(
                <div className="job-container" key={job.id}>
                    <h3><span>{job.title}</span></h3>
                    <h6><label>About the job</label></h6>
                    <p>{job.description}</p>
                    <h5>Company: {job.company_name}</h5>
                    <p>Location: {job.location}</p>
                    <label>Key responsibilities:</label>
                    <p>{job.job_type}</p>
                    <p>Salary: {job.salary_range}</p>
                    <label>Apply here:</label>
                    <CvUploads />
                    <p>Posted: {new Date (job.created_at).toLocaleDateString()}</p>
                </div>
            ))}</div>
            </div>
            </div>
       
    );
    
}
export default Dashboard;