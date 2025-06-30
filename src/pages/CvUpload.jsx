import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function CvUploads() {
    const {token} = useContext(AuthContext);
    const navigate = useNavigate();

    const [cv, setCv] = useState(null);

    const handleFileChange=(e)=>{
        setCv(e.target.files[0]);
    }
 const handleSubmit=async(e)=>{
        e.preventDefault();

        const formData= new FormData();
        formData.append("cv",cv);
        const token=localStorage.getItem("token");
        try {
            await axios.post("https://job-hiring-backend.onrender.com/api/upload/upload-cv",formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                    Authorization:`Bearer ${token}`,
                },
            });
            alert("CV uploaded successfully!");
            navigate("/dashboard");
        } catch (error) {
          console.error("Upload failed:",error);
          alert("Upload failed");
        }
    }

    return(
    <div>
        <form onSubmit={handleSubmit}>
        <input type="file" name="cv" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
        <button type="submit">Submit</button>
        </form>
    </div>
    );
    
}
export default CvUploads;