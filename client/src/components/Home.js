import React,{useEffect} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom';
import Nav from './Nav';
import './css/home.css'


export default function Home() {
  const navigate = useNavigate();
  useEffect(()=>{
    // checkAuth();

// eslint-disable-next-line
},[])

const checkAuth = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/isLogin`, {
      withCredentials: true 
    });
    
    if (response.status !== 200) {
      navigate('/');
    } else {
      console.log("You are successfully logged in!");
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
    navigate('/');
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
