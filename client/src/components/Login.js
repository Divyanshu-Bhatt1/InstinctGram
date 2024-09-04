import React,{useState} from 'react'
import { Link,useNavigate } from 'react-router-dom';

import  "./css/log.css";
import image from "./images/login.jpg"
import axios from 'axios'


export default function Login({setIsLoggedIn,setUserId}) {
  const navigate = useNavigate();
   const [email,setEmail]=useState('')
   const [pass,setPass]=useState('')



   const changePass=(e)=>{
       setPass(e.target.value);
   }

   const changeEmail=(e)=>{
    setEmail(e.target.value);
}

  const appPost=()=>{
    const url=`${process.env.REACT_APP_BACK_URL}/log_page`;
    console.log('Request URL:', url);
    const data={email,pass};
    axios.post(url, data,{ withCredentials: true }) 
  .then(response => {
            if(response.status===200)
            {
              setIsLoggedIn(true);
              // console.log("id : ",response.data,response)
              // setUserId(response.data.userId)
              navigate('/home');
            }
            console.log('Response from server:', response.data);
  })
  .catch(error => {
            console.error('Error sending data:', error);
  });
  }

  return (
    <>

        <div className="container">
              <div className="box">
                        <div className="image">
                               <img src={image} alt="log img"/>
                        </div>
                        <div className="content"> 
                                 <div>
                                 <span className="sp1">Log in</span>  <Link to="/reg_page"><span className="sp2">create an account</span></Link>
                                 </div>
                                 <br></br>
                                 <br></br>
                                 <input name="email" type="email" id="email" value={email} onChange={changeEmail} placeholder="Enter the valid Email" required/>
                                 <br></br>
                                 <br></br>
                                 <input name="pass" type="password" id="pass" value={pass} onChange={changePass} placeholder="Enter the valid Password" required/>
                                 <br></br>
                                 <br></br>
                                 <button onClick={appPost}>Login</button>
                        </div>
                  
              </div>
        </div>
 
    </>
      
    
  )
}
