import React,{useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse ,faSearch,faCompass,faFilm,faCommentDots,faHeart,faPlus,faUser,faRightFromBracket} from '@fortawesome/free-solid-svg-icons'; 
import "./css/nav.css"
import { Link } from 'react-router-dom';

export default function Nav() {

   
  return (
    <div className="nav-cont">
          <h2 className='nav-h'>Instinctgram</h2>
          {/* <h3 style={{color:'white'}}>{data}</h3>
          <button onClick={handleData}>Click me</button> */}
          <nav className="nav-1">
          <Link className='link1' to='/home' ><div className='nav-item'><FontAwesomeIcon className='nav-icon' icon={faHouse} /><li>Home</li></div> </Link>
          <Link className='link1' to='/search' ><div className='nav-item'><FontAwesomeIcon className='nav-icon' icon={faSearch} /><li>Search</li></div></Link>
          <Link className='link1' to='/explore' ><div className='nav-item'><FontAwesomeIcon className='nav-icon' icon={faCompass} /><li>Explore</li></div></Link>
          <Link className='link1' to='/reels' ><div className='nav-item'><FontAwesomeIcon className='nav-icon' icon={faFilm} /><li>Reels</li></div></Link>
          <Link className='link1' to='/messages' ><div className='nav-item' ><FontAwesomeIcon className='nav-icon' icon={faCommentDots} /><li>Messages</li></div></Link>
          <Link className='link1' to='/notifi' ><div className='nav-item'><FontAwesomeIcon className='nav-icon' icon={faHeart} /><li>Notification</li></div></Link>
          <Link className='link1' to='/create' ><div className='nav-item'><FontAwesomeIcon className='nav-icon' icon={faPlus} /><li>Create</li></div></Link>
          <Link className='link1' to='/profile' ><div className='nav-item'><FontAwesomeIcon className='nav-icon' icon={faUser} /><li>Profile</li></div></Link>
          <Link className='link1 logOut' to='/logout' ><div className='nav-item'><FontAwesomeIcon className='nav-icon' icon={faRightFromBracket} /><li>Logout</li></div></Link>
          </nav>        
    </div>
  )
}
