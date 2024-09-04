import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse ,faSearch,faCompass,faFilm,faCommentDots,faHeart,faPlus,faUser,faRightFromBracket} from '@fortawesome/free-solid-svg-icons'; 
import "./css/nav.css"
import { Link } from 'react-router-dom';

export default function SmallNav() {
  return (
    <div className="small-nav-cont">
          {/* <h2 className='nav-h'>Instantgram</h2> */}
          <nav className="nav-2">
          <Link className='link1' to='/home' ><div className='nav-item'><FontAwesomeIcon className='nav-icon' icon={faHouse} /></div> </Link>
          <Link className='link1' to='/search' ><div className='nav-item'><FontAwesomeIcon className='nav-icon' icon={faSearch} /></div></Link>
          <Link className='link1' to='/explore' ><div className='nav-item'><FontAwesomeIcon className='nav-icon' icon={faCompass} /></div></Link>
          <Link className='link1' to='/reels' ><div className='nav-item'><FontAwesomeIcon className='nav-icon' icon={faFilm} /></div></Link>
          <Link className='link1' to='/messages' ><div className='nav-item' ><FontAwesomeIcon className='nav-icon' icon={faCommentDots} /></div></Link>
          <Link className='link1' to='/notifi' ><div className='nav-item'><FontAwesomeIcon className='nav-icon' icon={faHeart} /></div></Link>
          <Link className='link1' to='/create' ><div className='nav-item'><FontAwesomeIcon className='nav-icon' icon={faPlus} /></div></Link>
          <Link className='link1' to='/profile' ><div className='nav-item'><FontAwesomeIcon className='nav-icon' icon={faUser} /></div></Link>
          <Link className='link1 logOut' to='/logout' ><div className='nav-item'><FontAwesomeIcon className='nav-icon' icon={faRightFromBracket} /></div></Link>
          </nav>
    </div>
  )
}