import React,{useEffect} from 'react'
import {Outlet, Navigate,useNavigate} from 'react-router-dom'
import useStore from "./store";
import axios from 'axios'
import  {io}  from 'socket.io-client';


function PrivateRoutes() {
  const { isAuthenticated, setIsAuthenticated,setUserId ,setSocket} = useStore()
  const navigate = useNavigate();

  useEffect(() => {
      const checkAuthentication = async () => {
          try {
              const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/check-token`); // Backend route to verify token
              setIsAuthenticated(true);
              setUserId(response.data.user.id)
              const newSocket = io(`${process.env.REACT_APP_BACK_URL}`, {
                auth: {
                  token: response.data.user.id
                }
              });
        
              setSocket(newSocket);

              // Cleanup function to disconnect the socket when the component unmounts
      return () => {
        if (newSocket) {
          newSocket.disconnect();
          setSocket(null);
        }
      };


          } catch (error) {
              setIsAuthenticated(false);
            //   window.location.href = '/'; // Redirect if token is invalid or expired
            navigate('/'); 
          }
      };

      checkAuthentication();
  }, []);
  // const auth={token:false};
  return (
        isAuthenticated
        ?
        <Outlet/>
        :
        <Navigate to="/"/>
  )
}

export default PrivateRoutes
