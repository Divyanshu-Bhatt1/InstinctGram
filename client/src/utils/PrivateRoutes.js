import React,{useEffect} from 'react'
import {Outlet, Navigate,useNavigate} from 'react-router-dom'
import useStore from "./store";
import axios from 'axios'
import  {io}  from 'socket.io-client';


function PrivateRoutes() {
  const { setIsAuthenticated, setUserId,socket, setSocket, isAuthenticated } = useStore();
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

              newSocket.on("disconnect", () => {
                console.log("Socket disconnected fx in Private");
                setSocket(null)
              });

              // Cleanup function to disconnect the socket when the component unmounts
      return () => {
        if (socket) {
          socket.disconnect();
          alert("private Disconnection in Cleanup!")
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


  useEffect(() => {
    // Prevent right-click context menu
    const preventRightClick = (event) => {
      event.preventDefault();
    };

    // Detect when DevTools might be opened
    const detectDevTools = (threshold = 160) => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      return widthThreshold || heightThreshold;
    };

    const checkDevTools = async() => {
      if (detectDevTools()) {

        const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/logout`, {}, {
          withCredentials: true
        });
  
        if (response.status === 200) {
          setIsAuthenticated(false);
          navigate('/');
        }
        
        // alert("Please close developer tools!");
        // window.location.reload()
      }
    };

    // Add event listeners
    document.addEventListener("contextmenu", preventRightClick);
    window.addEventListener("resize", checkDevTools);

    return () => {
      // Clean up event listeners
      document.removeEventListener("contextmenu", preventRightClick);
      window.removeEventListener("resize", checkDevTools);
    };
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
