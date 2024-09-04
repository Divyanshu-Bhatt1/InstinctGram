import React, { useState } from 'react'
// import Nav from './Nav';
import "./css/search.css";
import axios from "axios";
import { faSearch} from '@fortawesome/free-solid-svg-icons'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DiffProfile from './DiffProfile';
import NavCompo from "./NavCompo";


export default function Search() {

    const [input,setInput]=useState("")
    const [results,setResults]=useState([])
    const [mark,setMark]=useState(true)
    const [diffId,setDiffId]=useState('');



    const fetchData=async(value)=>{
        console.log('val',value)
        try {
            if(value===''||value===undefined)
            {
                setResults([])
            }else{
            const response = await axios.get(
              `${process.env.REACT_APP_BACK_URL}/get-users?data=${value}`,
              {
                withCredentials: true,
              },
            );
      
            
            console.log(response.data.results)
            setResults(response.data.results)
            }
          } catch (error) {
            console.log(error);
          }
    }

    const handleChange=(value)=>
    {
             setInput(value)
             fetchData(value)
    }

    const handleProfile=(e)=>{
      const id = e.currentTarget.getAttribute('data-id');
      console.log("ID:", id);
      setDiffId(id)
      setMark(false)
    }

  return (
    <div className='home-cont'>
       {/* <h1>i am home</h1> */}
       <div className='nav-home'>
       <NavCompo/>
       </div>
       <div className='content-home' >
        
       {mark ? (
           <>
        <div className="search-cont">
            <div className='search-wrapper'>
                <FontAwesomeIcon className='search-icon' icon={faSearch} />
                <input className='search-bar' placeholder='Type to Search ...' value={input} onChange={(e)=>handleChange(e.target.value)}></input>
            </div>
        </div>
        <div className='result-wrapper'>
            <div className='results-list'>
                {results.map((result, id) => (
                    <div className='search-res' key={id}  data-id={result._id} onClick={handleProfile}>{result.name}</div>
                ))}
            </div>
        </div>
    </>
) : <DiffProfile diffId={diffId} />}

       </div>
    </div>
  )
}
