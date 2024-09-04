import React,{useEffect} from 'react'
import  useStore from "./store";
import {Outlet, Navigate, useNavigate} from 'react-router-dom'
import axios from 'axios'

export default function PublicRoutes() {
    
    const { isAuthenticated, setIsAuthenticated,setUserId } = useStore()
    const navigate=useNavigate()

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/check-token`); // Backend route to verify token
                setUserId(response.data.user.id)
                // console.log(response.data.user.id)
                setIsAuthenticated(true);
                navigate('/home')
            } catch (error) {
                setIsAuthenticated(false);
                // window.location.href = '/'; // Redirect if token is invalid or expired
            }
        };
  
        checkAuthentication();
    }, []);

    console.log('isAuthenticated:', isAuthenticated);
    return (
          !isAuthenticated
          ?
          <Outlet/>
          :
          <Navigate to="/home"/>
    )
}
