import { useState } from "react";

function SearchInput({onSearch}) {

    const [input, setInput] = useState("");

    const handleChange=(e)=>{
        setInput(e.target.value);
        onSearch(e.target.value);
    }

    return(
        <div className="search-bar">
            <input type="text" value={input} onChange={handleChange} placeholder="Search jobs..." />
        </div>
    );
    
}
export default SearchInput;