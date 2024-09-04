import React,{useEffect} from 'react'
import Nav from './Nav';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


export default function LogOut({setIsLoggedIn}) {
    const navigate = useNavigate();
  useEffect(()=>{
    
     sureOrNot();
     // eslint-disable-next-line
  },[])

  const sureOrNot = async () => {
    try {
      const userConfirmed = window.confirm("Are you sure you want to log out?");
  
      if (userConfirmed) {
        const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/logout`, {}, {
          withCredentials: true
        });
  
        if (response.status === 200) {
          setIsLoggedIn(false);
          navigate('/');
        } else {
          // If the response status is not 200, navigate to home as a fallback
          navigate('/home');
        }
      } else {
        // If the user cancels the logout, navigate them back home
        navigate('/home');
      }
    } catch (error) {
      // Handle any errors that occur during the logout process
      console.error('Logout error:', error);
      navigate('/'); // Redirect to the main page in case of an error
    }
  };
  

  return (
    <div className='home-cont'>
    {/* <h1>i am home</h1> */}
    <div className='nav-home'>
    <Nav/>
    </div>
    <div className='content-home'>
             
             <h1>Hello</h1>
    </div>
 </div>
  )
}
