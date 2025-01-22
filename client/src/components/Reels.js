import React,{useState,useEffect,useRef,useCallback} from 'react'
// import Nav from './Nav'
import NavCompo from "./NavCompo";
import './css/reels.css'
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp,faTimes ,faUser ,faVolumeMute ,faPlay,faHeart,faComment,faPaperPlane,faCheck } from '@fortawesome/free-solid-svg-icons';
import useStore from '../utils/store';
import DiffProfile from './DiffProfile';

export default function Reels() {

  const {userId ,socket} = useStore()


  const [reel, setReel] = useState(null);
  const [mark, setMark] = useState(true);
  const [mark1,setMark1]=useState(true);
  const [page, setPage] = useState(1);
  const [page1, setPage1] = useState(1);
  const videoRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [vol,setVol]=useState(false)
  const [play,setPlay]=useState([])
  const [expanded, setExpanded] = useState([]);
  const [like,setLike]=useState([])
  const [commentOnOrOff,setCommentOnOrOff]=useState([])
  const [cmtText,setCmtText]=useState('');
  const [actCmt,setActCmt]=useState(null);
  const [friends,setFriends]=useState([])

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
         
    }
}


const postCmt=async(id)=>{
  try {
    const formData = new FormData();
    formData.append('id',id); 
    formData.append('cmtText', cmtText);


    setCmtText('')
   
    const result = await axios.post(`${process.env.REACT_APP_BACK_URL}/comment`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Correct Content-Type for FormData
      },
      withCredentials: true 
    });
    
    // console.log(result.data.name)
    // setActCmt(prevComments => [...prevComments, { comment: result.data.comment, postedBy:result.data.postedBy, name: result.data.name?result.data.name : 'Unknown' }]);
    
   
   
  } catch (error) {
    console.error('Error uploading image:', error);
    alert('Error uploading image');
  }
}

 const getComments=async(id,val=page1)=>{
  try {
  console.log("Page : ",val,page1)
  const response = await axios.get(
    `${process.env.REACT_APP_BACK_URL}/getComments?id=${id}&page=${val}`,
    {
      withCredentials: true,
    },
  );

  if(response.data.cmtArr.length===0)
  {
       setMark1(false);
  }
  console.log(response.data)
  
  setActCmt((prevCard) =>
        prevCard
          ? [...prevCard, ...response.data.cmtArr]
          : response.data.cmtArr,
      );

  setPage1(prevPage1 => prevPage1 + 1);
  
} catch (error) {
  console.log(error);
}
 }

  const handleCommentOnOrOff=async(id,index)=>{
    if(!commentOnOrOff[index]===true)
    {
      await getComments(id)
    }else{
      setActCmt(null)
      
      setPage1(1)
    }
     setMark1(true)
    console.log(index," cmtOnorOff")
    setCommentOnOrOff(prevCmt => {
      const newCmt = [...prevCmt];
      newCmt[index] = !newCmt[index];
      return newCmt;
  });
  }
  

const handleLike=async(id,index)=>{
  console.log(id,"hai")
  setLike(prevLike => {
    const newLike = [...prevLike];
    newLike[index] = !newLike[index];
    return newLike;
});
    if(like[index]===true)
    {
      try { 
        const response = await axios.get(
          `${process.env.REACT_APP_BACK_URL}/UnLike-vid?id=${id}`,
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
          `${process.env.REACT_APP_BACK_URL}/Like-vid?id=${id}`,
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

const handleExp=(index)=>{
  setExpanded(prevExp => {
    const newExp = [...prevExp];
    newExp[index] = !newExp[index];
    return newExp;
});
}

 const handleVol=()=>{
    setVol(!vol);
        
    // Mute/unmute all videos
    videoRefs.current.forEach(video => {
        video.muted = !vol;
    });
 }

 const handlePlay=(index)=>{
 

  setExpanded(prevExp => {
    const newExp = [...prevExp];
    newExp[index] = false;
    return newExp;
});


  setPlay(prevPlay => {
    const newPlay = [...prevPlay];
    newPlay[index] = !newPlay[index];
    return newPlay;
});

if (!play[index]) {
    videoRefs.current[index].pause();
} else {
    videoRefs.current[index].play();
}
}


const handleSlide = useCallback(() => {
  const reelContainer = document.getElementById('scrollableDiv');
  const scrollPosition = reelContainer.scrollTop;
  const videoHeight = reelContainer.offsetHeight;

  const index = Math.round(scrollPosition / videoHeight);
  if (index !== currentIndex) {
    setCurrentIndex(index);
    setCommentOnOrOff(Array(reel.length).fill(false));
    setActCmt(null);
    setPage1(1);
  }
}, [currentIndex, reel?.length]);
 
  // const handleSlide = () => {
   
    
  //   const reelContainer = document.getElementById('scrollableDiv');
  //   const scrollPosition = reelContainer.scrollTop;
  //   const videoWidth = reelContainer.offsetWidth;
  //   let index = Math.round(scrollPosition / videoWidth);
  //   console.log("index ",index)
  //   if(index!==0)
  //   {
  //     index=Math.round(index/2);
  //   }
  //   console.log("index ",index)
  //   // setCurrentIndex(index);
  //   if (currentIndex !== index) {
  //     setCurrentIndex(index);
  //     setCommentOnOrOff(Array(reel.length).fill(false));
  //     setActCmt(null)
      
  //     setPage1(1)
  //   }
  //   // console.log("reelContainer.scrollTop : ",reelContainer.scrollTop," reelContainer.offsetWidth : ",reelContainer.offsetWidth)
  //   // console.log('Current Index:', index);
    
  // };


  useEffect(()=>{
        
        getReel();
        getFriends()
        // eslint-disable-next-line
  },[])

  const getReel = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_URL}/reels-vid?limit=6&page=${page}`,
        {
          withCredentials: true,
        },
      );

      if (response.data.vidArr.length === 0) {
        setMark(false);
      }
      // console.log(response.data.vidArr,response.data.likeCountValues)
      setReel((prevCard) =>
        prevCard
          ? [...prevCard, ...response.data.vidArr]
          : response.data.vidArr,
      );
      console.log(response.data.likeCountValues,response.data.vidArr)
      setPlay(prevPlay => [...prevPlay, ...new Array(response.data.vidArr.length).fill(false)]);
      setExpanded(prevExp => [...prevExp, ...new Array(response.data.vidArr.length).fill(false)]);
      setCommentOnOrOff(prevCmt => [...prevCmt, ...new Array(response.data.vidArr.length).fill(false)]);
      setLike((prevLike) =>
        prevLike
          ? [...prevLike, ...response.data.likeCountValues]
          : response.data.likeCountValues,
      );
      
      setPage(prevPage => prevPage + 1);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    console.log(like);
  },[like])
  
 
  useEffect(() => {
    console.log("index : ",currentIndex)
    if (reel && typeof currentIndex !== 'undefined') {
      videoRefs.current[currentIndex].currentTime = 0;
      setPlay(prevPlay => {
        const newPlay = [...prevPlay];
        newPlay[currentIndex] = false;
        return newPlay;
    });

        videoRefs.current.forEach((video, index) => {
            if (index === currentIndex) {
                video.play(); 
            } else {
                video.pause();
            }
        });
    }
}, [currentIndex, reel,videoRefs]);

const [difPersonId,setDifPersonId]=useState(null);

const [idClick,setIdClick]=useState(false);

const handleIdClick=(id)=>{
  setDifPersonId(id)
  setIdClick(true);
  
}


const getFriends=async()=>
  {
       try {
              const response = await axios.get(
                `${process.env.REACT_APP_BACK_URL}/getFriends`,
                {
                  withCredentials: true,
                },
              );
            
              

              setFriends((prevCard) =>
                prevCard
                  ? [...prevCard, ...response.data.friendsArr]
                  : response.data.friendsArr,
              );

              response.data.friendsArr.map((friend)=>{
                return(
                  handleOnlineOrOffline(friend._id,friend.isOnline)
                )
              })
              
            } catch (error) {
              console.log(error);
            }
  }
  
  const [shareId,setShareId]=useState()
  const [share,setShare]=useState(false);
  

  const handleShareEnable=(id)=>{
    setShareId(id)
    setShare(true)
  }
  const [onlineOrOffline,setOnlineOrOffline]=useState({})
  const handleOnlineOrOffline = useCallback((user_id, isOnline) => {

    setOnlineOrOffline(prevStatus => ({
      ...prevStatus,
      [user_id]: isOnline,
    }));
    
  }, [onlineOrOffline]);


  
  const [selectedFriends, setSelectedFriends] = useState([]);

  // Handle friend selection
  const handleFriendClick = (friendId) => {
    setSelectedFriends((prevSelected) =>
      prevSelected.includes(friendId)
        ? prevSelected.filter((id) => id !== friendId) // Deselect if already selected
        : [...prevSelected, friendId] // Add if not selected
    );
  };

 const handleSendCross=()=>
  {
    setFriends(null)
    getFriends()
    setSelectedFriends([]);
    setShare(false);
  }

  const handleSendPostToFriends = async () => {
    
    setShare(false)

     console.log(userId)
      // const data = {
      //   sender_id: myId,
      //   receiver_id: friendId,
      //   messages: shareId,
      // };
  
    alert("Post is send to the friends !")
    // console.log(selectedFriends)
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/sendPostToFriends`,
        {
          shareId,
          friendIds: selectedFriends,
        },
        {
          withCredentials: true,
        }
      );


  
      if (response.status === 200) {
        console.log('Post sent successfully!');

        selectedFriends.forEach(id => {
          socket?.emit("newChats", {
            sender_id: userId,
            receiver_id: id,
            messages: shareId
          });
        });
        // socket?.emit("newChats", data);
      } else {
        console.error('Failed to send post');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  


  return (
    <div className='home-cont'>
       {/* <h1>i am home</h1> */}
       <div className='nav-home'>
       <NavCompo/>
       </div>

       <div className='content-home'>
               {!idClick ?(<div className='reels-cont' >
                    
               <div className='reels-child' >     
                    {reel && <InfiniteScroll
                          dataLength={reel.length}
                          next={getReel}
                          hasMore={mark}
                          loader={<h4>Wait ...</h4>}
                          onScroll={handleSlide}
                           endMessage={
                             <p style={{ textAlign: "center" }}>
                              <b>Yay! You have seen it all</b>
                              </p>
                            }
                          scrollableTarget="scrollableDiv"
                         
                       >
                       <div  id='scrollableDiv' >
                         
                         {reel &&
    reel.map((data, index) => {
        const newPath = data.url.split("\\").slice(1).join("\\");
        return (
          <div className='flex-reel' key={index+1}>
          <div className='individual-reel' key={index}>
          <video key={index}  onClick={()=>{handlePlay(index)}} className='reel' autoPlay muted={!vol} loop ref={(el) => (videoRefs.current[index] = el)} 
          
         >
         
                <source src={`${process.env.REACT_APP_BACK_URL}/${newPath}`} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className='post-Detail' style={{height: expanded[index] ? '150px' : '100px'}}>
                  
                  <div className='reel-user-icon-cont' onClick={()=>{handleIdClick(data.userId)}}>
                  <FontAwesomeIcon className='reel-user-icon' icon={faUser} />
                  </div>
                  <span className='reel-user-name' onClick={()=>{handleIdClick(data.userId)}}>{data.name}</span>
                 {data.userId!=userId && <div className="reel-foll-btn" >Follow</div>}
                  <div className='reel-caption-cont'  style={{ height: expanded[index] ? '110px' : '20px', overflowY: expanded[index] ?  'scroll': 'hidden', transition: 'height 0.3s ease' }}>
                      <p style={{width:'300px', height: '20px' , color:'white'}}>{data.caption}</p> 
                  </div>
                  {!expanded[index] && data.caption.length>35 && <span className='more-btn' onClick={() => handleExp(index)}>More ...</span>}
            </div>

            

            <div className='vol-btn' onClick={handleVol}>
            {vol?(<FontAwesomeIcon icon={faVolumeUp} style={{color:'white' }}/>):(<FontAwesomeIcon icon={faVolumeMute} style={{ color:'white' }} />)}
            </div>
           {play[index] &&<div className='play-btn' onClick={()=>{handlePlay(index)}}>
               <FontAwesomeIcon style={{color:'white'}} size='2x' icon={faPlay} />
            </div>}

           </div>

           <div className='reels-other-cont'>
                <div className='individual-icon'>
                <FontAwesomeIcon style={{color:!like[index]?'white':'#ff3a33', fontSize:'24px'} }  icon={faHeart} onClick={()=>{handleLike(data._id,index)}}/>
                <br></br>
                <span>Likes</span>
                </div>

                <div className='individual-icon'>
                <FontAwesomeIcon style={{ fontSize:'24px'} }   icon={faComment} onClick={()=>{handleCommentOnOrOff(data._id,index)}}/>
                <br></br>
                <span>Comment</span>
                </div>

                <div className='individual-icon' >
                <FontAwesomeIcon  style={{fontSize:'24px'} }   icon={faPaperPlane}  onClick={()=>{handleShareEnable(data._id)}} />
                <br></br>
                <span>Share</span>
                </div>
           </div>

          

           {commentOnOrOff[index]&& <div className='comment-cont'>
                    <div className='comment-header'>
                    <FontAwesomeIcon style={{color:'white' }} size='2x' icon={faTimes} onClick={()=>{handleCommentOnOrOff(data._id,index)}}/>
                    <span style={{color:'white',     margin:'0 86px',fontSize: '20px'}}>Comments</span>
                    </div>
                    <hr></hr>
                    <div className='comment-data' id='scrollableDiv3'>
                    <InfiniteScroll
                          dataLength={actCmt?.length}
                          next={()=>{getComments(data._id)}}
                          hasMore={mark1}
                          loader={<h4>Wait ...</h4>}
                        
                          //  endMessage={
                          //    <p style={{ textAlign: "center" }}>
                          //     <b>Yay! You have seen it all</b>
                          //     </p>
                          //   }
                          scrollableTarget="scrollableDiv3"
                         
                       >

                    {actCmt && actCmt.map((item, id) => (
                      <div key={id} style={{marginBottom: '8px'}}>
                       <p style={{fontSize:'18px',fontWeight:'200',color:'white'}}> <span className='cmt-name' style={{fontSize:'18px',fontWeight:'600', margin:'0 10px',cursor:'pointer'}} onClick={()=>{handleIdClick(item.postedBy)}}>{item.name}: </span>
                              {item.comment}
                        </p>
                      </div>
                    ))}  
                    </InfiniteScroll>                  
                         
                    </div>
                    <hr></hr>
                    <input type='text' className='comment-inp' onChange={handleComment} onKeyDown={(e)=>{handleSubmit(e,data._id)}} value={cmtText}></input>
           </div>}

            

           </div>
        );
    })
}

{share&& <div className='friends-cont-pop'>
  <FontAwesomeIcon className='Close-pop' style={{color:'white' }} size='2x' icon={faTimes} onClick={()=>{handleSendCross()}}/>

    <div className='friends-cont-pop-ch'> 

{ friends.map((friend,id)=>{
                 return(
   <div className='user-cont-pop' key={id} data-id={friend._id} onClick={() => handleFriendClick(friend._id)}>
       <FontAwesomeIcon className='user1-icon' icon={faUser} />
       <div className='friend-name-cont'>
          <p>{friend.name}</p> 
       </div>
       <div className={`onlineOrOffline ${onlineOrOffline[friend._id] ? 'online' : 'offline'}`}></div>
       {selectedFriends.includes(friend._id) && (
            <FontAwesomeIcon className="blue-tick" icon={faCheck}  />
          )}
   </div> 
  )})} 

  </div> 
  <div className='send-btn' onClick={()=>{handleSendPostToFriends()}}>Send</div>

</div>}
                             </div>
                             </InfiniteScroll>}



                    </div>

               </div>):(<DiffProfile diffId={difPersonId} />)}



      </div>

      </div>
     
  )
}
