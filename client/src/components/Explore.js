import React,{useState,useEffect,useRef} from 'react'
import axios from 'axios'
// import Nav from './Nav';
import NavCompo from "./NavCompo";

import "./css/explore.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo,faImage,faTimes,faUser,faVolumeUp  ,faVolumeMute ,faPlay ,faHeart,faComment,faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import useStore from '../utils/store';

export default function Explore() {

  const {userId}=useStore()


  const [what1,setWhat1]=useState('')
    const [card, setCard] = useState(null);
  const [mark, setMark] = useState(true);
  const [page, setPage] = useState(1);
 const [vidOrReel,setVidOrReel]=useState('')
  const [src,setSrc]=useState('');
  const [popUp,setPopUp]=useState(false)
  const [vol,setVol]=useState(false)
  const [play,setPlay]=useState(false)

  const [addi,setAddi]=useState(null)
  const [expanded,setExpanded]=useState(false)
  const [cmtText,setCmtText]=useState('');
  const [like,setLike]=useState(false)

  const [mark1,setMark1]=useState(true);
  const [page1, setPage1] = useState(1);
  const [actCmt,setActCmt]=useState(null);
 
  const handleComment=(e)=>{
           setCmtText(e.target.value)
  }

  const handleSubmit=async(e,id)=>{
    if(e.key==='Enter')
    {
        console.log("post hoga ab")
        await postCmt(id)
         setActCmt(null)
         setPage1(1);
         
         await getComments(id,1)
        // postCmt(id)
    }
}



const postCmt=async(id)=>{
  try {
    const formData = new FormData();
    formData.append('id',id); 
    formData.append('cmtText', cmtText);

    setCmtText('')

    
    if(what1==='vid'){
    const result = await axios.post(`${process.env.REACT_APP_BACK_URL}/comment`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Correct Content-Type for FormData
      },
      withCredentials: true 
    });
    console.log(result)
  }else if((what1==='img')){
    const result = await axios.post(`${process.env.REACT_APP_BACK_URL}/comment-post`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Correct Content-Type for FormData
      },
      withCredentials: true 
    });
    console.log(result)
  }
    
    // console.log(result.data.name)
    // setActCmt(prevComments => [...prevComments, { comment: result.data.comment, postedBy:result.data.postedBy, name: result.data.name?result.data.name : 'Unknown' }]);
    
   
   
  } catch (error) {
    console.error('Error uploading image:', error);
    alert('Error uploading image');
  }
}

 const getComments=async(id,val=page1,what=what1)=>{
  console.log("Page : ",what)
  try {
  console.log("Page : ",val,page1,id,vidOrReel)

  

  if(what==='vid')
  {
   let response = await axios.get(
    `${process.env.REACT_APP_BACK_URL}/getComments?id=${id}&page=${val}`,
    {
      withCredentials: true,
    },
  );

  if( response.data.cmtArr.length===0)
  {
       setMark1(false);
  }
  // console.log(response.data)
  if(response.data && response.data.cmtArr){
  setActCmt((prevCard) =>
        prevCard
          ? [...prevCard, ...response.data.cmtArr]
          : response.data.cmtArr,
      );

  setPage1(prevPage1 => prevPage1 + 1);
  }
  

  }else if(what==='img'){
   let response = await axios.get(
      `${process.env.REACT_APP_BACK_URL}/getCommentsPost?id=${id}&page=${val}`,
      {
        withCredentials: true,
      },
    );

    if( response.data.cmtArr.length===0)
    {
         setMark1(false);
    }
    // console.log(response.data)
    if(response.data && response.data.cmtArr){
    setActCmt((prevCard) =>
          prevCard
            ? [...prevCard, ...response.data.cmtArr]
            : response.data.cmtArr,
        );
  
    setPage1(prevPage1 => prevPage1 + 1);
    }
    

  }


} catch (error) {
  console.log(error);
}
 }




const handleLike=async(id)=>{
  console.log(id,"hai",what1,"hai")
  setLike(!like)
    if(like===true)
    {
      try { 
        const response = await axios.get(
          `${process.env.REACT_APP_BACK_URL}/UnLike-${what1}?id=${id}`,
          {
            withCredentials: true,
          },
        );
         
        console.log(response.status," ",response.data)
        
      } catch (error) {
        console.log(error);
      }
    }else{
      try { 
        const response = await axios.get(
          `${process.env.REACT_APP_BACK_URL}/Like-${what1}?id=${id}`,
          {
            withCredentials: true,
          },
        );
         
        console.log(response.status," ",response.data)
        
      } catch (error) {
        console.log(error);
      }
    }
}


  const handleExp=()=>{
        setExpanded(!expanded)
  }

  const handleVol=()=>{
    setVol(!vol);     
 }

 const handlePlay=(e)=>{
  setPlay(!play)
  if (e.target instanceof HTMLVideoElement) {
    videoRef.current = e.target;
    console.log('Clicked video:', videoRef.current);
    if(!play)
    {
    videoRef.current.pause();
    }else{
      videoRef.current.play();
    }
  }

 }

 const videoRef = useRef(null);




  const handleCross=()=>{
    // setAddi(null)
    setExpanded(false)
    setPopUp(false);
   setPlay(false);
  //  setVol(false);

   setPage1(1);
   setActCmt(null);
  }

  const handleVidOrReel=async(src,what,id)=>{
      //  console.log(src," src",what," ",id)
       setWhat1(what)
       await additionalData(id,what)
       setSrc(src)
       setVidOrReel(what)
       setPopUp(true)
       console.log(what)
       await getComments(id,page1,what)

  }

  const additionalData=async(id,what)=>{
    try {
      let response = await axios.get(
          `${process.env.REACT_APP_BACK_URL}/additionalData-${what}?id=${id}`,
          {
            withCredentials: true,
          },
        );
      if(response.status===200){
      setAddi(response.data.addiArr)
      console.log(response.data.likedByCurrentUser,"bta")
      setLike(response.data.likedByCurrentUser)
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
     
        getCard();
        // eslint-disable-next-line
  },[])

  const getCard = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_URL}/get-explore?limit=5&page=${page}`,
        {
          withCredentials: true,
        },
      );

      if (response.data.expArr.length === 0) {
        setMark(false);
      }
      console.log(response.data.expArr)
      setCard((prevCard) =>
        prevCard
          ? [...prevCard, ...response.data.expArr]
          : response.data.expArr,
      );
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.log(error);
    }
  };


  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const style1 = {
    height: windowWidth > 1110 ? '632px' : '433.974px',
    width: windowWidth > 1110 ? '316px' : '216px',
    borderRadius: '5px'
  };

  const style2 = {
    height:windowWidth > 1110 ? '316px':'216px',
    width: windowWidth > 1110 ?'316px':'216px',
    borderRadius: '5px'
  };

  // const style1={
  //    height:'632px',
  //    width:'316px',
  //    borderRadius: '5px'
  // }

  // const style2={
  //   height:'316px',
  //   width:'316px',
  //   borderRadius: '5px'
  // }

  return (
    <div className='home-cont' id='scrollableDiv2'>
       {/* <h1>i am home</h1> */}
       <div className='nav-home'>
       <NavCompo/>
       </div>
       <div className='content-home'  style={{display:'flex', justifyContent:'center'}} >
        {popUp&&<div className='cont-popUp'>
                <div className='vidOrReel-popUp-cont'>
                     {
                       vidOrReel==='vid'?(
                        <div className='vid-popUp-cont'>
                        <video className='popUp-reelOrvid' muted={!vol} ref={videoRef} onClick={(e)=>{handlePlay(e)}} autoPlay loop >
                        <source src={src} type='video/mp4'  />
                         Your browser does not support the video tag.
                        </video>
                        <div className='vol-btn' onClick={handleVol}>
                           {vol?(<FontAwesomeIcon icon={faVolumeUp} style={{color:'white' }}/>):(<FontAwesomeIcon icon={faVolumeMute} style={{ color:'white' }} />)}
                      </div>
                       {/* {play[index] &&<div className='play-btn'> */}
                       {play && <div className='play-btn'>
                           <FontAwesomeIcon style={{color:'white'}} size='2x' icon={faPlay} />
                       </div>}
                       </div> ):(
                        <img src={src} alt={`picturehai`} className='popUp-reelOrvid'/>
                       )
                     }
                </div>
                <div className='comments-popUp'>
                     <div className='explore-user-detail' style={{height: expanded ? '20vh' : '13vh'}}>
                     <div className='reel-user-icon-cont'>
                  <FontAwesomeIcon className='reel-user-icon' icon={faUser} />
                  </div>
                  <span className='reel-user-name'>{addi.name}</span>
                  {!addi.isSameUser &&<div className="reel-foll-btn" >Follow</div>}
                  <div className='reel-caption-cont'  style={{ height: expanded ? '80px' : '20px', width:'32vw', overflowY: expanded ?  'scroll': 'hidden', transition: 'height 0.3s ease' }}>
                      <p style={{ height: '20px' ,width:'29vw' , color:'white'}}>{addi.caption}</p> 
                  </div>
                  {!expanded && addi.caption.length>62 && <span className='more-btn' style={{left:'432px'}}onClick={() => handleExp()}>More ...</span>}
                  
                     </div>

                  <div className='exp-cmt-cont' id="scrollableDiv4" style={{ height: expanded ? '55vh' : '62vh' ,overflowY:'scroll',padding:'10px'}}>
                  {actCmt && <InfiniteScroll
                          dataLength={actCmt?.length}
                          next={()=>{getComments(addi._id)}}
                          hasMore={mark1}
                          loader={<h4>Wait ...</h4>}
                        
                          //  endMessage={
                          //    <p style={{ textAlign: "center" }}>
                          //     <b>Yay! You have seen it all</b>
                          //     </p>
                          //   }
                          scrollableTarget="scrollableDiv4"
                         
                       >

                    {actCmt && actCmt.map((item, id) => (
                      <div key={id} style={{marginBottom: '8px'}}>
                       <p style={{fontSize:'18px',fontWeight:'200',color:'white'}}> <span style={{fontSize:'18px',fontWeight:'600', margin:'0 10px'}}>{item.name}: </span>
                              {item.comment}
                        </p>
                      </div>
                    ))}  
                    </InfiniteScroll>  } 
                  </div>

                  <div className='exp-icon-cont' style={{backgroundColor: '#35374B',borderBottom:'1px solid white'}}>
                       
                    
                  <div className='exp-other-cont'>
                <div className='individual-icon'>
                <FontAwesomeIcon style={{color:!like?'white':'#ff3a33', fontSize:'24px'} }  icon={faHeart} onClick={()=>{handleLike(addi._id)}}/>
               
                </div>

                <div className='individual-icon'>
                <FontAwesomeIcon style={{ fontSize:'24px'} }   icon={faComment} />
          
                </div>

                <div className='individual-icon'>
                <FontAwesomeIcon  style={{fontSize:'24px'} }   icon={faPaperPlane}   />
                
                </div>
           </div>



                  </div>
                  <input type='text' className='exp-comment-inp' onChange={handleComment} onKeyDown={(e)=>{handleSubmit(e,addi._id)}} value={cmtText}></input>
                </div>
                <FontAwesomeIcon icon={faTimes} size='2x'  className='cross-btn' onClick={handleCross}/>
        </div>}
       {card && <InfiniteScroll
                          dataLength={card.length}
                          next={getCard}
                          hasMore={mark}
                          loader={<h4>Wait ...</h4>}
                           endMessage={
                             <p style={{ textAlign: "center" }}>
                              <b>Yay! You have seen it all</b>
                              </p>
                            }
                          scrollableTarget="scrollableDiv2"
                          className='Scroll-Compo'
                         
                       >
                 {!popUp &&<div className='explore-cont' >

                         {card &&card.map((item, index) => {
                            
                            const newPath = item.url.split("\\").slice(1).join("\\");
                            const cycle=10;
                            const currentStyle = index% cycle === 2 || index% cycle === 5 ? style1 : style2;
                            
                        
                            
                            return(
                         <div className={`explore-item ${index% cycle === 2 ? 'explore-item1' : index% cycle === 5 ? 'explore-item2' : ''}`} key={index}>
                              {item.fileType === 'video' ? (
                                <div className='reel-cont' onClick={()=>{handleVidOrReel(`${process.env.REACT_APP_BACK_URL}/${newPath}`,'vid',item._id)}}>
                                       <video  style={currentStyle} >
                                                 <source src={`${process.env.REACT_APP_BACK_URL}/${newPath}`} type='video/mp4' />
                                                  Your browser does not support the video tag.
                                        </video>
                                        <FontAwesomeIcon icon={faVideo}   className='vid-btn'/>
                                      
                                 </div>
                             ) : (
                              <div className='reel-cont' onClick={()=>{handleVidOrReel(`${process.env.REACT_APP_BACK_URL}/${newPath}`,'img',item._id)}}>
                                      <img src={`${process.env.REACT_APP_BACK_URL}/${newPath}`} alt={`pic ${index + 1}`} style={currentStyle}/>
                                      <FontAwesomeIcon icon={faImage}   className='vid-btn'/>
                                      </div>
                             )}
                             
                       </div>
                         )})}
                        
                                                            
                 </div>}
                 </InfiniteScroll>}
       </div>
    </div>
  )
}
