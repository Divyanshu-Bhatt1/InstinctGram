import React,{useState,useEffect, useCallback,useRef} from 'react'
import SmallNav from './SmallNav'
import './css/messages.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons'; 
import axios from 'axios'
// import { useSocket } from './ServerSocketProvider';
import { io } from 'socket.io-client';
import useStore from '../utils/store';




export default function Messages() {
  const [typing,setTyping]=useState(false)
  const [isTyping,setIsTyping]=useState(false)

  const {socket,setSocket}=useStore()
  // const socket=useSocket()
  // const [socket,setSocket]=useState(useSocket())
  const [myMsg,setMyMsg]=useState('');
  const [friends,setFriends]=useState([])
  const [friendId,setFriendId]=useState(null)
  const [myId,setMyId]=useState(null)
  const [onlineOrOffline,setOnlineOrOffline]=useState({})
  const [friendName,setFriendName]=useState('')

   const [messages,setMessages]=useState([])
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
    scrollToBottom()
  }, [messages]);



const handleOfflineUser=(data)=>{
     handleOnlineOrOffline(data.user_id,0)
}

const handleOnlineUser=(data)=>{
    handleOnlineOrOffline(data.user_id,1)
}

const handleOnlineOrOffline = useCallback((user_id, isOnline) => {

  setOnlineOrOffline(prevStatus => ({
    ...prevStatus,
    [user_id]: isOnline,
  }));
  
}, [onlineOrOffline]);


const handleLoadNewChats=(data)=>{

if(myId===data.friendId && friendId===data.myId){
  if(data.msg.trim() !== '')
  {
    setMessages((prevState)=>[...prevState,{who:'diffUser',msg:data.msg}])
  }
}
}

const handleExistChats=(data)=>{
  
  data.chats.forEach((chat)=>{
       
    if(chat.messages.trim() !== '')
    {
      if(myId===chat.sender_id && friendId===chat.receiver_id)
      {
      setMessages((prevState)=>[...prevState,{who:'currentUser',msg:chat.messages}])
      }else{
      setMessages((prevState)=>[...prevState,{who:'diffUser',msg:chat.messages}])
      }
    }

  })
 
}


useEffect(()=>{
  
},[onlineOrOffline])






useEffect(()=>{
   socket?.on('getOnlineUser',handleOnlineUser)
   socket?.on('getOfflineUser',handleOfflineUser)
   socket?.on('loadNewChats',handleLoadNewChats)
   socket?.on('loadExistChats',handleExistChats)

   return ()=>{
    socket?.off('getOnlineUser',handleOnlineUser)
    socket?.off('getOfflineUser',handleOfflineUser)
    socket?.off('loadNewChats',handleLoadNewChats)
    socket?.off('loadExistChats',handleExistChats)
   }
})
 
const scrollToBottom = () => {
  if (messageContainerRef.current) {
    messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  }
};

 

  const getUserData=async()=>
  {
    try {
   
    const response = await axios.get(
      `${process.env.REACT_APP_BACK_URL}/getProfileUser`,
      {
        withCredentials: true,
      },
    );
 
    setMyId(response.data.profileData._id)

  } catch (error) {
    console.log(error);
  }
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



  const handleFriend=(e,name)=>{
    
       const id = e.currentTarget.getAttribute('data-id');
      setFriendName(name)
       setFriendId(id)
       setMessages([])
       
      
       socket?.emit('existChats',{sender_id:myId,receiver_id:id})
       
     }

  const handleMyMsg=(e)=>{
      setMyMsg(e.target.value);
  }

  


  const handleSubmit=(e)=>{
          if(e.key==='Enter')
          {
              postData();
          }
  }

  const postData=async()=>{
      const data={
        sender_id:myId,
        receiver_id:friendId,
        msg:myMsg
      }

      try {
        const response=await axios.post(`${process.env.REACT_APP_BACK_URL}/saveChats`,data)
        if(response.status===200)
        {
         
          if(response.data.msg.trim() !== '')
          {
           setMessages((prevState)=>[...prevState,{who:'currentUser',msg:response.data.msg}])
           const data={
            msg:response.data.msg,
            friendId:response.data.friendId,
            myId:response.data.myId
           }
           socket?.emit('newChats',data)
          }
        }
      } catch (error) {
         console.log("error",error)
      }
  }



  return (
    <div className='home-cont'>
       {/* <h1>i am home</h1> */}
       <div className='small-nav-home'>
           <SmallNav/>
       </div>
       <div className='msg-cont-h'>
            <div className='msg-h-cont'>
                <h3 style={{color:'white'}}>Messages</h3>
            </div>
            <div className='friends-cont'>

                   { friends.map((friend,id)=>{
                                    return(
                      <div className='user-cont' key={id} data-id={friend._id} onClick={(event) => handleFriend(event, friend.name)}>
                          <FontAwesomeIcon className='user1-icon' icon={faUser} />
                          <div className='friend-name-cont'>
                             <p>{friend.name}</p> 
                          </div>
                          <div className={`onlineOrOffline ${onlineOrOffline[friend._id] ? 'online' : 'offline'}`}></div>
                      </div> 
                     )})} 
                   
            </div>
       </div>
       <div className='content-home'>
              <div className='friend-title'>
                     <h2>{friendName}</h2>
              </div>
              <div className='messages' ref={messageContainerRef}>
                      
                      {messages.map((message,id)=>(
                        <div className={message.who} key={id}>
                          <h5 style={{wordWrap: 'break-word'}}>{message.msg}</h5>
                      </div>  
                      ))}


                      
              </div>
              <div className='input-field-msg'>
                        <input className='msg-inp' value={myMsg} onChange={handleMyMsg} onKeyDown={handleSubmit} placeholder='Message...'/>
              </div>
       </div>
    </div>
  )
}



