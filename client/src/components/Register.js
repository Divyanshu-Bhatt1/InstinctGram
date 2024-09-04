import React,{useState} from 'react'
import {Link,useNavigate} from 'react-router-dom';
import  "./css/log.css";
import image from "./images/login.jpg"
import axios from 'axios'



export default function Register() {
    const navigate = useNavigate();
   const [email,setEmail]=useState('')
   const [pass,setPass]=useState('')
   const [name,setName]=useState('')



   const changePass=(e)=>{
       setPass(e.target.value);
   }

   const changeEmail=(e)=>{
    setEmail(e.target.value);
}
const changeName=(e)=>{
    setName(e.target.value);
}

  const appPost=()=>{
            const url=`${process.env.REACT_APP_BACK_URL}/reg_page`;
            const data={name,email,pass};
            axios.post(url, data,{ withCredentials: true })
          .then(response => {

            if(response.status===200)
            {
              // console.log(response,response.data)
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
                                 <span className="sp1">Register</span>  <Link to="/"><span className="sp2">For Log in</span></Link>
                                 </div>
                                 <br></br>
                                 <br></br>
                                 <input name="name" type="text" id="name" value={name} onChange={changeName} placeholder="Enter Your Name" required/>
                                 <br></br>
                                 <br></br>
                                 <input name="email" type="email" id="email" value={email} onChange={changeEmail} placeholder="Enter the valid Email" required/>
                                 <br></br>
                                 <br></br>
                                 <input name="pass" type="password" id="pass" value={pass} onChange={changePass} placeholder="Enter the valid Password" required/>
                                 <br></br>
                                 <br></br>
                                 <button onClick={appPost}>Register</button>
                        </div>
                  
              </div>
        </div>

    </>
      
    
  )
}
