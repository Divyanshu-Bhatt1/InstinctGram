import React, { useState,useEffect,useRef} from "react";
// import Nav from "./Nav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser ,faImage} from "@fortawesome/free-solid-svg-icons";
import "./css/profile.css";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "./Spinner";
import ProfilePostPopUp from "./ProfilePostPopUp";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavCompo from "./NavCompo";







export default function Card() {

 

 
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


  const [privateOrPublic,setprivateOrPublic]=useState('')


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
        `${process.env.REACT_APP_BACK_URL}/getProfilePost?limit=6&page=${page}`,
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
        `${process.env.REACT_APP_BACK_URL}/getProfileVid?limit=6&page=${page1}`,
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
      `${process.env.REACT_APP_BACK_URL}/getProfileUser`,
      {
        withCredentials: true,
      },
    );
    console.log("user data : ",response.data.profileData)
    setUserName(response.data.profileData.name)
    setNoOfPosts(response.data.profileData.posts)
    setNoOfFollowers(response.data.profileData.followers)
    setNoOfFollowing(response.data.profileData.following)
    setprivateOrPublic(response.data.profileData.privateOrPublic)
    if(response.data.profileData.privateOrPublic==='private')
    {
      checkboxRef.current.checked=false
    }else{
      checkboxRef.current.checked=true
    }
   
  } catch (error) {
    console.log(error);
  }
  }
  useEffect(() => {

    getCard();
    getUserData();
    // eslint-disable-next-line
  }, []);

  const checkboxRef = useRef(null);

  const handleButtonClick = () => {
    if (checkboxRef.current.checked) {
      console.log('Checkbox is checked');
      setprivateOrPublic('public')
      priOrPub('public')
    } else {
      console.log('Checkbox is not checked');
      setprivateOrPublic('private')
      priOrPub('private')
    }
  };


  const priOrPub=async(check)=>{
    try{
     const response=await axios.get(
      `${process.env.REACT_APP_BACK_URL}/changePrivateorPublic?privateOrPublic=${check}`,
      {
        withCredentials: true,
      },
    );
    console.log(response.data)
  }catch(err)
  {
          console.log('please try again to make it visibility changed')
  }
  }



  return (
    <div className="home-cont">
      <div className="nav-home">
       <NavCompo/>
      </div>
      <div className="content-home" style={{display:'flex', justifyContent:'center'}}>
       {popUp && <ProfilePostPopUp what1={what1} id={postId} src={src} vol={vol} handleVol={handleVol} handleCross={handleCross}/>}
        {!popUp && <div className="profile-cont">
          <div className="Upper-profile-child">
            <div className="profile-pic">
              <FontAwesomeIcon className="profile-pic-child" icon={faUser} />
            </div>
            <div className="user-info">
              <h2 className="user-Name">{userName}</h2>
              <div className="record">
                <span className="rec-data">posts:{noOfPosts}</span>
                <span className="rec-data">followers:{noOfFollowers}</span>
                <span className="rec-data">following:{noOfFollowing}</span>
              </div>
              <div  style={{display:'flex', gap:'20px',marginTop:'12px'}}>
              <div className="form-check form-switch">
                   <input ref={checkboxRef} onChange={handleButtonClick} className="form-check-input" style={{width:'40px'}} type="checkbox" id="flexSwitchCheckDefault" />
                   
                </div>
               <span className="rec-data" style={{fontSize:'20px'}}>{privateOrPublic}</span>
              </div>
            </div>
          </div>
          <hr className="hr-profile"></hr>
          <div className="Lower-profile-child" id="scrollableDiv1">
          <div className='post-span-div'>
                 <span className="post-span" style={{  borderBottom: isClicked ?'2px solid white' : 'none' }} onClick={handleClick}>Posts</span>
                 <span className="post-span" style={{ borderBottom: !isClicked ?'2px solid white' : 'none' }} onClick={handleClick}>Reels</span>
          </div>
            

           
             
             {isClicked&& <div className="post-div">
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

              {!isClicked&& <div className="vid-div">
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
      </div>
    </div>
  );
}