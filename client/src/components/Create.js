import React,{useState,useCallback} from 'react'
// import Nav from './Nav'
import './css/create.css'
import media from './images/media.png'
import axios from 'axios'
import NavCompo from "./NavCompo";


export default function Create() {

    const [caption,setCaption]=useState('');
    const [file, setFile] = useState(null);
    const [toggleInp,setToggleInp]=useState(true)
  

  // const handleFileChange = (e) => {

  //   const selectedFile = e.target.files[0];
  //   const MAX_SIZE = 20 * 1024 * 1024;

  //   if (selectedFile) {
  //     if (selectedFile.size > MAX_SIZE) {
  //       alert("The file size exceeds the 20MB limit. Please select a smaller file.");
  //       setFile(null)
  //       setToggleInp(true)
  //     } else {
  //       setFile(selectedFile); 
  //       setToggleInp(false)
  //     }
  //   } else {
  //     console.log("No file selected");
  //   }

    
    
  // };



  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const MAX_SIZE = 20 * 1024 * 1024;
    const MAX_DURATION = 90; 

    if (selectedFile) {
      if (selectedFile.size > MAX_SIZE) {
        alert("The file size exceeds the 20MB limit. Please select a smaller file.");
        setFile(null);
        setToggleInp(true);
        setCaption('')
      } else if (selectedFile && selectedFile.type &&selectedFile.type.includes('video')) {
        // Create a video element to check duration
        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';

        videoElement.onloadedmetadata = () => {
          window.URL.revokeObjectURL(videoElement.src);
          if (videoElement.duration > MAX_DURATION) {
            alert(`The video exceeds the maximum duration of ${MAX_DURATION} seconds.`);
            setFile(null);
            setToggleInp(true);
            setCaption('')
          } else {
            setFile(selectedFile);
            setToggleInp(false);
          }
        };

        videoElement.src = URL.createObjectURL(selectedFile);
      } else {
        setFile(selectedFile);
        setToggleInp(false);
      }
    } else {
      console.log("No file selected");
      setCaption('')
    }
  };





    const handleCaption=(e)=>{
        setCaption(e.target.value);
}



const createPost=useCallback(async()=>{

  if(caption==='')
  {

    alert('Please fill the caption field')
    return;
  }

 
    try {
      if(file){
        console.log(file)
        if (file && file.type &&file.type.includes('image')) {
            console.log('Selected file is an image');
           await uploadImg()
            
            // Handle image file
        } else if (file && file.type &&file.type.includes('video')) {
            console.log('Selected file is a video');
           
            
           await uploadVed()
            // Handle video file
        } else {
            console.log('Selected file is neither an image nor a video',file);
            alert('Selected file is neither an image nor a video')
            setToggleInp(true)
            setFile(null)
            setCaption('')
            // Handle other types if needed
        }
       
         console.log('file upload successfully')

      }else{
        console.log("no file is selected")
        alert('no file is selected')
        setToggleInp(true)
      }
        
      } catch (err) {
        console.log('Error uploading file:', err);
      }
// eslint-disable-next-line
},[file,caption])

const uploadVed=useCallback(async()=>{
  try {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('caption', caption);
    
    
    // const data={
    //   caption:caption
    // }
    // console.log(data)
    // Send the file to the backend
    await axios.post(`${process.env.REACT_APP_BACK_URL}/upload-video`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'

      },
      withCredentials: true 
    });
    
    alert('File uploaded successfully');
    setToggleInp(true)
    setFile(null)
    setCaption('')
  } catch (error) {
    console.error('Error uploading file:', error);
    alert('Error uploading file');
  }
},[file,caption])

const uploadImg=useCallback(async()=>{
  try {
    const formData = new FormData();
    formData.append('image', file); // Assuming 'image' as the field name for the image
    formData.append('caption', caption);

    // const data={
    //   caption:caption
    // }
    console.log(formData)
    // Send the image to the backend
    await axios.post(`${process.env.REACT_APP_BACK_URL}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true 
    });
    
    alert('File uploaded successfully');
    setToggleInp(true)
    setFile(null)
    setCaption('')
  } catch (error) {
    console.error('Error uploading image:', error);
    alert('Error uploading image');
  }
},[file,caption])



  return (
    <div className='home-cont'>
       {/* <h1>i am home</h1> */}
       <div className='nav-home'>
       
       <NavCompo/>
       </div>
       <div className='content-home'>
                <div className='create-cont'>
                         <div className='create-content-cont'>
                                  <textarea type='text' value={caption} onChange={handleCaption} id='caption' name='caption' placeholder='Write the caption ...' required rows="4" cols="50"/>
                                  <br/>
                                  <br/>
                                  {toggleInp&&<label className='media-upload' htmlFor='file' onChange={handleFileChange}>
                                  
                                       <img className='media-img' src={media} alt=''/>
                                       <span>Drag photos and videos here </span>
                                       <span>(only give image in jpg not in png)</span>
                                       
                                      <input type="file" id="file" name="file"  onChange={handleFileChange}></input> 
                                         
                                  </label>}
                                  <br/>
                                  <br/>
                                  <button onClick={createPost}>Submit</button>
                                  
                         </div>
                         

                </div>
                
       </div>
    </div>
  )
}
