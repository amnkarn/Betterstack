import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import type React from "react";


export function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
      
        <Route path="/home" element={
          <ProtectRouter>
            <Dashboard />
          </ProtectRouter>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App


function ProtectRouter({ children }: { children: React.ReactNode }) {
  const cookies = document.cookie;
  const token = cookies.includes('token=') ? cookies.split('token=')[1].split(';')[0] : null;
  //console.log(token);

  if(!token) {
    return <Navigate to={"/"} />
  }

  return <>{ children }</>
}