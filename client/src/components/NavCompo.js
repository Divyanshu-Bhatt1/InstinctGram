import React, { useEffect,useState} from 'react'
import SmallNav from './SmallNav';
import Nav from './Nav';

export default function NavCompo() {
    const [isSmallScreen,setIsSmallScreen]=useState(false);

    const updateScreenSize = () => {
        setIsSmallScreen(window.innerWidth < 1360);
      };

    useEffect(()=>{
       window.addEventListener('resize',updateScreenSize)
       updateScreenSize();
  
    return () => {
      window.removeEventListener('resize', updateScreenSize);
    };
    },[])
  return (
    <>
      {isSmallScreen ? <SmallNav /> : <Nav />}
    </>
  )
}
