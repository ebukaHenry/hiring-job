import { useContext } from "react";
import SearchInput from "./SearchInput";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


function Navbar({onSearch}) {

    const {token, logout} = useContext(AuthContext);
    const user = token ? jwtDecode(token) : null;
    const navigate= useNavigate();

    const handleLogout=()=>{
        logout();
        navigate("/");
    }

    return(
        <div>
            <nav className="navbar">
            <div className="nav-logo"> <Link to="/" className="no-link-style"><h4><span>Work-now</span></h4></Link></div>
            <div className="nav-search">
            <SearchInput onSearch={onSearch}/>
            </div>
            <div className="nav-action">
                {token ? (<button onClick={handleLogout}>Logout</button>) :
                (
                    <Link to="/login"><button>Login</button></Link>
                ) }
            </div>
            </nav>
        </div>
    );
    
}
export default Navbar;