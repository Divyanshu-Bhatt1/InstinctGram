import React, { useState, useEffect, useCallback, useRef } from "react";
import SmallNav from "./SmallNav";
import "./css/messages.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InfiniteScroll from "react-infinite-scroll-component";
import {faEye, faVideo,faImage,faTimes,faUser,faVolumeUp  ,faVolumeMute ,faPlay ,faHeart,faComment,faPaperPlane,faCheck} from '@fortawesome/free-solid-svg-icons';

import axios from "axios";
// import { useSocket } from './ServerSocketProvider';
import { io } from "socket.io-client";
import useStore from "../utils/store";

export default function Messages() {
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { socket, setSocket,userId } = useStore();
  // const socket=useSocket()
  // const [socket,setSocket]=useState(useSocket())
  const [myMsg, setMyMsg] = useState("");
  const [friends, setFriends] = useState([]);
  const [friendId, setFriendId] = useState(null);
  const [myId, setMyId] = useState(null);
  const [onlineOrOffline, setOnlineOrOffline] = useState({});
  const [friendName, setFriendName] = useState("");

  const [messages, setMessages] = useState([]);
  const messageContainerRef = useRef(null);

  useEffect(() => {
    getUserData();
    getFriends();
  }, []);

  // useEffect(() => {

  //     const newSocket = io('process.env.REACT_APP_SOCKET_URL', {
  //       auth: {
  //         token: myId
  //       }
  //     });

  //     setSocket(newSocket);

  //     return () => {
  //       // alert('hello')
  //       newSocket.disconnect();
  //     };

  // }, [myId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOfflineUser = (data) => {
    handleOnlineOrOffline(data.user_id, 0);
  };

  const handleOnlineUser = (data) => {
    handleOnlineOrOffline(data.user_id, 1);
  };

  const handleOnlineOrOffline = useCallback(
    (user_id, isOnline) => {
      setOnlineOrOffline((prevStatus) => ({
        ...prevStatus,
        [user_id]: isOnline,
      }));
    },
    [onlineOrOffline]
  );

  const handleLoadNewChats = (data) => {
    if (myId === data.receiver_id && friendId === data.sender_id) {
      if (data.messages.trim() !== "") {
        setMessages((prevState) => [
          ...prevState,
          { who: "diffUser",...data },
        ]);
      }
    }
  };

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const handleExistChats = (data) => {
    data.chats.forEach((chat) => {
      if (chat.messages.trim() !== "") {
        if (myId === chat.sender_id && friendId === chat.receiver_id) {
          setMessages((prevState) => [
            ...prevState,
            { ...chat, who: "currentUser" },
          ]);
        } else if (myId === chat.receiver_id && friendId === chat.sender_id) {
          setMessages((prevState) => [
            ...prevState,
            { ...chat, who: "diffUser" },
          ]);
        }
      }
    });
  };

  useEffect(() => {}, [onlineOrOffline]);

  useEffect(() => {
    // if (!socket) return;

    socket?.on("getOnlineUser", handleOnlineUser);
    socket?.on("getOfflineUser", handleOfflineUser);
    socket?.on("loadNewChats", handleLoadNewChats);
    socket?.on("loadExistChats", handleExistChats);

    return () => {
      socket?.off("getOnlineUser", handleOnlineUser);
      socket?.off("getOfflineUser", handleOfflineUser);
      socket?.off("loadNewChats", handleLoadNewChats);
      socket?.off("loadExistChats", handleExistChats);
    };
  });

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  const getUserData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_URL}/getProfileUser`,
        {
          withCredentials: true,
        }
      );

      setMyId(response.data.profileData._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getFriends = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_URL}/getFriends`,
        {
          withCredentials: true,
        }
      );

      setFriends((prevCard) =>
        prevCard
          ? [...prevCard, ...response.data.friendsArr]
          : response.data.friendsArr
      );

      response.data.friendsArr.map((friend) => {
        return handleOnlineOrOffline(friend._id, friend.isOnline);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFriend = (e, name) => {
    const id = e.currentTarget.getAttribute("data-id");
    setFriendName(name);
    setFriendId(id);
    setMessages([]);

    socket?.emit("existChats", { sender_id: myId, receiver_id: id });
  };

  const handleMyMsg = (e) => {
    setMyMsg(e.target.value);
  };

  const handleSubmit = (e) => {
    if (e.key === "Enter") {
      postData();
    }
  
  };

  const handleSubmitCmt=async(e,id)=>{
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

  const postData = async () => {
    const data = {
      sender_id: myId,
      receiver_id: friendId,
      messages: myMsg,
    };

    setMyMsg("")

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/saveChats`,
        data
      );
      if (response.status === 200) {
        // console.log(response.data)
        if (response.data.chat.messages.trim() !== "") {
          setMessages((prevState) => [
            ...prevState,
            { who: "currentUser", ...response.data.chat },
          ]);
          //  const data={
          //   messages:response.data.messages,
          //   friendId:response.data.friendId,
          //   myId:response.data.myId
          //  }
          socket?.emit("newChats", data);
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };



  const [vidOrReel,setVidOrReel]=useState('')
  const [src,setSrc]=useState('');
  const [popUp,setPopUp]=useState(false)
  const [addi,setAddi]=useState(null)
  const [expanded,setExpanded]=useState(false)
  const [cmtText,setCmtText]=useState('');
  const [like,setLike]=useState(false)
  const [vol,setVol]=useState(false)
  const [play,setPlay]=useState(false)
  const [actCmt,setActCmt]=useState(null);
  const [mark1,setMark1]=useState(true);
  const [page1, setPage1] = useState(1);
  const [what1,setWhat1]=useState('')
  const [sameMsg,setSameMsg]=useState(null)

  
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

const [difPersonId,setDifPersonId]=useState(null);

const [idClick,setIdClick]=useState(false);



const additionalData=async(id,what,message)=>{
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
    setSameMsg(message)
    }

  } catch (error) {
    console.log(error);
  }
}


const handleVidOrReel=async(src,what,id,message)=>{
  //  console.log(src," src",what," ",id)
   setWhat1(what)
   await additionalData(id,what,message)
   setSrc(src)
   setVidOrReel(what)
   setPopUp(true)
   
   setShare(false)
   
   console.log(what)
   await getComments(id,page1,what)

}

const handleEyeDestiny=async(message)=>
  {
    const newPath = `${process.env.REACT_APP_BACK_URL}/${message.url.split("\\").slice(1).join("\\")}`;
    const w=message.fileType==='video'?'vid':'img';
    //  setPopUp(true);
     await handleVidOrReel(newPath,w,message._id,message);
  }


const handleIdClick=(id)=>{
  setDifPersonId(id)
  setIdClick(true);
  
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


 const handleComment=(e)=>{
  setCmtText(e.target.value)
}


const handleCross=()=>{
  // setAddi(null)
  // socket?.on("loadExistChats", handleExistChats);
  setExpanded(false)
  setPopUp(false);

  setShare(false)
 setPlay(false);
//  setVol(false);

 setPage1(1);
 setActCmt(null);
 
}

useEffect(()=>{
  if(!popUp)
  {
    scrollToBottom();
  }

},[popUp])



  


 
 const [shareId,setShareId]=useState()
 const [share,setShare]=useState(false);
 
 

 const handleShareEnable=(id)=>{
  //  setPopUp(false)
   setShareId(id)
   setShare(true)
 }

 
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


       selectedFriends.forEach(id => {
              if(id===friendId)
              {
                setMessages((prevState) => [
                  ...prevState,
                  { who: "currentUser",...sameMsg}
                ]);
              }
      });

       // socket?.emit("newChats", data);
     } else {
       console.error('Failed to send post');
     }
   } catch (error) {
     console.error('Error:', error);
   }
 };


 
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





  return (
    <div className="home-cont" style={{justifyContent:popUp?'center':''}}>
      {/* <h1>i am home</h1> */}
      {!popUp &&<div className="small-nav-home">
        <SmallNav />
      </div>}

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
                     <div className='reel-user-icon-cont' onClick={()=>{handleIdClick(addi.userId)}}>
                  <FontAwesomeIcon className='reel-user-icon' icon={faUser} />
                  </div>
                  <span className='reel-user-name' onClick={()=>{handleIdClick(addi.userId)}}>{addi.name}</span>
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
                       <p style={{fontSize:'18px',fontWeight:'200',color:'white'}}> <span className='cmt-name' style={{fontSize:'18px',fontWeight:'600', margin:'0 10px'}} onClick={()=>{handleIdClick(item.postedBy)}}>{item.name}: </span>
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
                <FontAwesomeIcon  style={{fontSize:'24px'} }   icon={faPaperPlane}  onClick={()=>{handleShareEnable(addi._id)}} />
                
                </div>
           </div>



                  </div>
                  <input type='text' className='exp-comment-inp' onChange={handleComment} onKeyDown={(e)=>{handleSubmitCmt(e,addi._id)}} value={cmtText}></input>
                </div>
                <FontAwesomeIcon icon={faTimes} size='2x'  className='cross-btn' onClick={handleCross}/>
        </div>}






      {!popUp &&<div className="msg-cont-h">
        <div className="msg-h-cont">
          <h3 style={{ color: "white" }}>Messages</h3>
        </div>
        <div className="friends-cont">
          {friends.map((friend, id) => {
            return (
              <div
                className="user-cont"
                key={id}
                data-id={friend._id}
                onClick={(event) => handleFriend(event, friend.name)}
              >
                <FontAwesomeIcon className="user1-icon" icon={faUser} />
                <div className="friend-name-cont">
                  <p>{friend.name}</p>
                </div>
                <div
                  className={`onlineOrOffline ${
                    onlineOrOffline[friend._id] ? "online" : "offline"
                  }`}
                ></div>
              </div>
            );
          })}
        </div>
      </div>}
      {!popUp &&<div className="content-home">
        <div className="friend-title">
          <h2>{friendName}</h2>
        </div>
        <div className="messages" ref={messageContainerRef}>
  {messages.map((message, id) => {
    // Adjust the path based on the correct separator for your environment
    const newPath = message?.url ? message.url.split("\\").slice(1).join("\\") : ""; // Replacing backslashes with forward slashes

    return message?.url ? (
      // Conditional rendering based on the fileType (image or video)
      <div className={`message-container ${message.who} reel-popUp`} key={id}>
        {message.fileType === 'video' ? (
          <video className="thumbnail-video" controls>
            <source src={`${process.env.REACT_APP_BACK_URL}/${newPath}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : message.fileType === 'image' ? (
          <img
            className="thumbnail-image"
            src={`${process.env.REACT_APP_BACK_URL}/${newPath}`}
            alt="message content"
          />
        ) : null}
        <FontAwesomeIcon icon={faEye} className="eye-Of-Destiny" onClick={()=>{handleEyeDestiny(message)}}/> 
      </div>
    ) : (
      <div className={message.who} key={id}>
        <h5 style={{ wordWrap: "break-word" }}>{message.messages}</h5>
      </div>
    );
  })}
</div>

        <div className="input-field-msg">
          <input
            className="msg-inp"
            value={myMsg}
            onChange={handleMyMsg}
            onKeyDown={handleSubmit}
            placeholder="Message..."
          />
        </div>
      </div>}
    </div>
  );
}
