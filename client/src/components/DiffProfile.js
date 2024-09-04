import React, { useState,useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "./css/profile.css";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "./Spinner";
import ProfilePostPopUp from "./ProfilePostPopUp";
import useStore from "../utils/store";

export default function DiffProfile(props) {

  const {userId}=useStore()


  const [card, setCard] = useState(null);
  const [card1, setCard1] = useState(null);
  const [page, setPage] = useState(1);
  const [page1, setPage1] = useState(1);
  const [mark, setMark] = useState(true);
  const [mark1, setMark1] = useState(true);
  const [isClicked, setIsClicked] = useState(true);

  const [userName,setUserName]=useState('');
  const [noOfPosts,setNoOfPosts]=useState(0);
  const [noOfFollowers,setNoOfFollowers]=useState(0);
  const [noOfFollowing,setNoOfFollowing]=useState(0);


  const [what1,setWhat1]=useState('')
  const [popUp,setPopUp]=useState(false)
  const [src,setSrc]=useState('')
  const [postId,setPostId]=useState('')
  const [vol,setVol]=useState(false)

  const [friendOrNot,setFriendOrNot]=useState(false)
  const [privateOrPublic,setprivateOrPublic]=useState('')
  const [visibility,setVisibility]=useState(false)

  const handleCross=()=>{
    setPopUp(false);
  }

  const handleVol=()=>{
    setVol(!vol);     
 }

  const handleVidOrReel=async(src,what,id)=>{
     setWhat1(what)
     setPopUp(true)
    setSrc(src)
    setPostId(id)
}
 


  const handleClick = () => {
    console.log(isClicked," b")
    setIsClicked(!isClicked); // Toggle the state when the div is clicked
    console.log(isClicked," a")
  };

  const handleFollow=async(friendOrNot)=>{
    try { 
      let action;
      console.log(friendOrNot,"in follow")
      if(!friendOrNot)
      {
         action='create'
      }else{
        action='delete'
      }
    const response = await axios.get(
      `${process.env.REACT_APP_BACK_URL}/${action}Friends?diffId=${props.diffId}`,
      {
        withCredentials: true,
      },
    );
     
    console.log(response.status," ",response.data)
    if(response.status===200)
    {
      alert(response.data)
      setVisibility(!visibility)
      setFriendOrNot(!friendOrNot)
    }
  } catch (error) {
    console.log(error);
  }
  }

  useEffect(()=>{
      if(!isClicked===true)
      {
        getCard1();
      }
      // eslint-disable-next-line
  },[isClicked])

  const getCard = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(page, "page hu");
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_URL}/getDiffProfilePost?limit=6&page=${page}&diffId=${props.diffId}`,
        {
          withCredentials: true,
        },
      );

      if (response.data.postArr.length === 0) {
        setMark(false);
      }
      console.log(response.data.postArr)
      setCard((prevCard) =>
        prevCard
          ? [...prevCard, ...response.data.postArr]
          : response.data.postArr,
      );
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const getCard1 = async () => {
    console.log("card1,")
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(page, "page hu");
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_URL}/getDiffProfileVid?limit=6&page=${page1}&diffId=${props.diffId}`,
        {
          withCredentials: true,
        },
      );

      if (response.data.vidArr.length === 0) {
        setMark1(false);
      }
      console.log(response.data.vidArr)
      setCard1((prevCard) =>
        prevCard
          ? [...prevCard, ...response.data.vidArr]
          : response.data.vidArr,
      );
      setPage1(prevPage => prevPage + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserData=async()=>
  {
    try {
    console.log(page, "page hu");
    const response = await axios.get(
      `${process.env.REACT_APP_BACK_URL}/getDiffProfile?diffId=${props.diffId}`,
      {
        withCredentials: true,
      },
    );
    // console.log("user data : ",response.data.friendOrNot)
    if(response.data.profileData.privateOrPublic==='public')
    {
      setVisibility(true)
    }else{
      setVisibility(false)
    }
    setprivateOrPublic(response.data.profileData.privateOrPublic)
    console.log(response.data.friendOrNot," in getUserData")
    setFriendOrNot(response.data.friendOrNot)
    setUserName(response.data.profileData.name)
    setNoOfPosts(response.data.profileData.posts)
    setNoOfFollowers(response.data.profileData.followers)
    setNoOfFollowing(response.data.profileData.following)
   
  } catch (error) {
    console.log(error);
  }
  }
  useEffect(() => {
    getCard();
    getUserData();
    // eslint-disable-next-line
  }, []);





  return (
    <>
    {popUp && <ProfilePostPopUp  what1={what1} id={postId} src={src} vol={vol} handleVol={handleVol} handleCross={handleCross}/>}
        
       {!popUp && <div className="profile-cont">
          <div className="Upper-profile-child">
            <div className="profile-pic">
              <FontAwesomeIcon className="profile-pic-child" icon={faUser} />
            </div>
            <div className="user-info">
              <h2 className="diffuser-Name">{userName}</h2>
              {props.diffId!=userId && <div className="foll-btn" style={{padding:'3px'}} onClick={()=>{handleFollow(friendOrNot)}}>{!friendOrNot?'Follow':'Following'}</div>}
              <div className="record">
                <span className="rec-data">posts:{noOfPosts}</span>
                <span className="rec-data">followers:{noOfFollowers}</span>
                <span className="rec-data">following:{noOfFollowing}</span>
              </div>
              <span className="rec-data" style={{fontSize:'20px'}}>{privateOrPublic} Account</span>
            </div>
          </div>
          <hr className="hr-profile"></hr>
          <div className="Lower-profile-child" id="scrollableDiv1">
          <div className='post-span-div'>
                 <span className="post-span" style={{  borderBottom: isClicked ?'2px solid white' : 'none' }} onClick={handleClick}>Posts</span>
                 <span className="post-span" style={{ borderBottom: !isClicked ?'2px solid white' : 'none' }} onClick={handleClick}>Reels</span>
          </div>
            

           
             
             {(friendOrNot||visibility) && isClicked&& <div className="post-div">
              {card && <InfiniteScroll
                  dataLength={card.length}
                  next={getCard}
                  hasMore={mark}
                  loader={<Spinner />}
                  endMessage={
                    <p style={{ textAlign: "center" }}>
                      <b>Yay! You have seen it all</b>
                    </p>
                  }
                  scrollableTarget="scrollableDiv1"
                >
                  {card &&
                    card.map((data,index) => {
                      const newPath = data.url.split("\\").slice(1).join("\\");

                      return (
                        <img
                          key={index}
                          className="post-data"
                          src={`${process.env.REACT_APP_BACK_URL}/${newPath}`}
                          alt="image12"
                          onClick={()=>{handleVidOrReel(`${process.env.REACT_APP_BACK_URL}/${newPath}`,'img',data._id)}}
                        />
                      );
                    })}
                    </InfiniteScroll>}
              </div>}

              {(friendOrNot||visibility)&& !isClicked&& <div className="vid-div">
              {card1 && <InfiniteScroll
                  dataLength={card1.length}
                  next={getCard1}
                  hasMore={mark1}
                  loader={<Spinner />}
                  endMessage={
                    <p style={{ textAlign: "center" }}>
                      <b>Yay! You have seen it all</b>
                    </p>
                  }
                  scrollableTarget="scrollableDiv1"
                >
                  {card1 &&
                    card1.map((data,index) => {
                      const newPath = data.url.split("\\").slice(1).join("\\");

                      return (
      
                        <video key={index} className="vid-data" onClick={()=>{handleVidOrReel(`${process.env.REACT_APP_BACK_URL}/${newPath}`,'vid',data._id)}}>
                                     <source src={`${process.env.REACT_APP_BACK_URL}/${newPath}`} type="video/mp4" />
                                      Your browser does not support the video tag.
                        </video>

                      );
                    })}
                    </InfiniteScroll>}
              </div>}


          </div>
        </div>}
        </>
  );
}