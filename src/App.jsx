import React from "react";
import { AuthProvider } from "./context/AuthContext";
import {BrowserRouter, Routes, Route,} from "react-router-dom"

import Register from "./pages/Register";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="container">
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
      
      
       
    </div>
  );
}

export default App;
