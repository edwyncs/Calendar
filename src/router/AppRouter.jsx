import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../auth";
import { CalendarPage } from "../calendar";
import { getEnvVariables } from "../helpers";
import { useAuthStore } from "../hooks";

export const AppRouter = () => {
    const { status, checkAuthToken } = useAuthStore();
    // const authStatus = 'not-authenticated'

    useEffect(() => {
      checkAuthToken()
    }, []);
    
    if (status === 'checking') {
      return (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <span className="loader"></span>
        </div>
      )
    };

  return (
    <Routes>
      {
        (status === 'not-authenticated') 
        ? (
            <>
              <Route path="auth/*" element={<LoginPage />}/>
              <Route path="/*" element={<Navigate to="auth/login"/>} />
            </>
          )
          : (
            <>
              <Route path="/" element={<CalendarPage/>} />
              <Route path="/*" element={<Navigate to="/"/>} />
            </>
          )
      }
      
    </Routes>
  )
};