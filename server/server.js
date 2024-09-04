require('dotenv').config();
const mongoose=require('mongoose')
const express=require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const cors=require('cors')
const { v4: uuidv4 } = require('uuid');
// const { Server: SocketIO } = require('socket.io');
// const { createServer } = require("http");
const multer  = require('multer')
const path =require('path')
// const session = require('express-session');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');






const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'backend/videos'); // Specify your backend folder here
    },
    filename: function (req, file, cb) {
      cb(null,uuidv4() + Date.now() + path.extname(file.originalname));
    }
  });

  const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'backend/images'); // Specify your backend folder here
    },
    filename: function (req, file, cb) {
      cb(null,uuidv4() + Date.now() + path.extname(file.originalname));
    }
  });
  
  // Initialize multer middleware
  const upload = multer({ storage: storage });
  const upload1 = multer({ storage: storage1 });
  // Route to handle video uploads


const app=express();
// const Server = createServer();
const { Schema } = mongoose;
const PORT=3001;
// const PORT1=3002;

// const io = new SocketIO(Server,{
//     cors:{
//         origin:`${process.env.FRONT_URL}`,
//         methods:["GET","POST"],
//     }
// });

app.use(cors({
    origin: `${process.env.FRONT_URL}`, // Replace with your React app's domain
    credentials: true // Enable credentials (cookies)
  }));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}))
app.use('/images', express.static(path.join(__dirname, 'backend', 'images')));
app.use('/videos', express.static(path.join(__dirname, 'backend', 'videos')));



mongoose.connect(process.env.MONGO_URL).then(()=>{console.log("Database is running successfully !")}).catch((err)=>{console.log("error occur in db : ",err)})


const userSchema = new Schema({
  name:{
    type:String,
    require:true
  },
  email:{
    type:String,
    require:true
  },
  password:{
    type:String,
    require:true
  },
  followers:{
    type:Number,
    default:0
  },
  following:{
    type:Number,
    default:0
  },
  posts:{
    type:Number,
    default:0
  },
  isOnline:{
    type:Number,
    default:0
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  privateOrPublic:{
    type:String,
    default:'private'
  }
});


const User=mongoose.model('user',userSchema);

const notifiSchema=new Schema({
        userId:{
          type: mongoose.Schema.Types.ObjectId, ref: 'User'
         },
         note:[{
          Type:{type:String},
          postedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }]
})

const Notifi=mongoose.model('notifi',notifiSchema)

const chatSchema=new Schema({
     sender_id:{
      type: mongoose.Schema.Types.ObjectId, ref: 'User'
     },
     receiver_id:{
      type: mongoose.Schema.Types.ObjectId, ref: 'User'
     },
     messages:{
      type:String,
     }
})

const Chat=mongoose.model('chat',chatSchema)


const reelSchema=new Schema({
  userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },  
    name:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    uplodeDate:{
         type:Date
    },
    fileType:{
        type:String,
    },
    likeCount:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments:[{
      comment:{type:String},
      postedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }]
    
})

const Reel=mongoose.model('reel',reelSchema);

const postSchema=new Schema({
  userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },  
    name:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    uplodeDate:{
         type:Date
    },
    fileType:{
        type:String,
    },
    likeCount:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments:[{
      comment:{type:String},
      postedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }]
})

const Post=mongoose.model('post',postSchema);




// const sessionIdToUserMap=new Map();

// const setUser=(id,user)=>{
//     sessionIdToUserMap.set(id,user);
// }

// const getUser=(id)=>{
//     return sessionIdToUserMap.get(id);
// }




// app.get("/isLogin",(req,res)=>{
    
//     const userUid = req.session.user?._id;


//      if(!userUid)
//      {
//         return res.status(401).send("Not Have access")
//      }
     

//      res.status(200).send({message:"Ok",email:req.session.user.email})
     
// })



// app.get("/isLogout",(req,res)=>{

//   const userUid = req.session.user?._id; 


//    if(userUid)
//    {
//       return res.status(401).send("Not Have access")
//    }

  //  const user=getUser(userUid);

  //  if(!user)
  //  {
  //     return res.status(401).send("Not Have access")
  //  }

//    res.status(200).send({message:"Ok"})
   
// })


app.get('/check-token', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
      return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
          return res.status(401).json({ message: 'Invalid or expired token' });
      }

      // console.log(decoded)

      
      res.status(200).json({ message: 'Token is valid', user: decoded });
  });
});

const getNameAndMail=async(id)=>
{
   try{
    const user=await User.findById(id).select('name email')
    // console.log(user,user.email,user.name)
   return user
   }catch(error)
   {
    console.log(error)
    return null
   }
}


app.post('/reg_page',async(req,res)=>{
    // console.log(req.body);
try{
    const {name,email}=req.body

    if(!(name && email && req.body.pass))
    {
      res.status(400).send('All fields are compulsory')
    }

    const existingUser=await User.findOne({email})

    if(existingUser)
    {
      res.status(401).send('User already exists with this email')
    }

    const pass=process.env.SECRET+req.body.pass;

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(pass, salt, function(err, hash) {
            // Store hash in your password DB.
        if(!err)
        {
            const newUser=new User({
                name:name,
                email:email,
                password:hash
            })


            
            newUser.save().then((user)=>{
            console.log("new user is created successfully!",user)
            const token=jwt.sign(
              {id:user._id,email},
              process.env.JWT_SECRET,
              {
                expiresIn:"2h"
              }
            )
            user.token=token
            user.password=undefined
                    
            res.status(200).json(user)
            }).catch((err)=>{
                console.log("Error is occured during created user !",err)
                res.status(404).send("Something Went Wrong");
            })

        }else{
            console.log("error aa gya user nhi banega !",err)
            res.status(404).send("Something Went Wrong");
        }

        });
    });
  }catch(error){
    console.log("Error is occured during created user !",error)
  }
})

app.post('/log_page',async(req,res)=>{
    
try{

  if(!(req.body.email && req.body.pass))
  {
    res.status(400).send('Send all Data');
  }

    const pass=process.env.SECRET+req.body.pass;
     
    let user=await User.findOne({email:req.body.email})

     if(!user)
     {
        res.status(401).send("User not found");
     }else{
    
        bcrypt.compare(pass, user.password, function(err, result) {
             if(!err)
            {
                
                if(result===true)
                {
                    console.log("congratulation you are connected")
                    
                   const token=jwt.sign(
                    {id:user._id},
                    process.env.JWT_SECRET
                   )

                   user.token=token;
                   user.password=undefined

                   const options={
                    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                    httpOnly:true
                   }
                   res.status(200).cookie("token",token,options).json({
                    success:true,
                    user:user
                   })
                    
                  
                    // res.status(200).send({message:"congratulation you are connected",userId:user._id});
                }else{
                    console.log("wrong pass",result)
                    res.status(401).send("Wrong password.");
                }
            }else{
                console.log("error aa gya user nhi hoga login !",err)
                res.status(404).send("Something Went Wrong");
            }
        });
    }
  }catch(error)
  {
    console.log("Error occured during logged in")
  }
   
})

// app.get('/logout',(req,res)=>{
//      req.session.destroy();
//      console.log('hello')
     
//      res.status(200).send("logout successfull")
// })

app.post('/logout',auth, (req, res) => {
  try{
  // Clear the JWT cookie
  res.clearCookie('token', {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production', // Ensure secure flag in production
    secure:false,
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
}catch(error)
{
  console.log("Error occured during logged in")
}
});

app.post('/upload-video',upload.single('video'),auth, async(req, res) => {
    // Handle the uploaded video
  try{
    // const userUid = req.session.user?._id;
    
    // const id=userUid;

    const id=req.user.id;
    const userData=await getNameAndMail(id)
   
    const data={
          id:id,
          name:userData.name,
          caption:req.body.caption,
          url:req.file.path,
          fileType:'video'
    }
    
    console.log(data);

   await createPost(data);
  //  await createReel(data);
    res.send('post uploaded successfully');
  }catch(err)
  {
    console.log("vedio mein ",err)
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
  
  });

  app.post('/upload-image',upload1.single('image'),auth, async(req, res) => {
    // Handle the uploaded video

    try{
    
    // const userUid = req.session.user?._id;


    // const id=userUid;
    const id=req.user.id;
    const userData=await getNameAndMail(id)
 
    const data={
          id:id,
          name:userData.name,
          caption:req.body.caption,
          url:req.file.path,
          fileType:'image'
    }
    // console.log('user',user)
    console.log(data);

   await createPost(data);
   
    res.send('post uploaded successfully');
  }catch(error)
  {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
  });

const createPost=async(data)=>{
    try{
      const newData={
        userId:data.id,
        name:data.name,
        caption:data.caption,
        url:data.url,
        fileType:data.fileType,
        likeCount:[],
        uplodeDate:Date.now(),
        comments:[]
      }
  
      if(data.fileType==='image'){
        const newpost=new Post(newData);
          newpost.save()
          .then(savedPost => {
                        console.log('Saved reel:', savedPost);
                        setPosts(data.id)
           })
            .catch(error => {
                        console.error('Error saving reel:', error);
           });

      }else if(data.fileType==='video')
      {
        const reel1=new Reel(newData);
         reel1.save()
          .then(savedReel => {
                        console.log('Saved reel:', savedReel);
                        setPosts(data.id)
           })
            .catch(error => {
                        console.error('Error saving reel:', error);
           });
      }

      // console.log('Post saved successfully:', updateUser);

    }catch(error) {
        console.error('Error saving post:', error,data);
    };

  
      }

      app.get('/getProfilePost',auth,async(req,res)=>{

        try{
        let page=Number(req.query.page) || 1;
        let limit=Number(req.query.limit) || 3; 
        // console.log(page," ",req.query.page)
        let skip=(page-1)*limit;

        // const userUid = req.session.user?._id;
      
        // const id=userUid;
       
        const id=req.user.id;


        const UserPost = await Post.find(
          {userId:id},
      ).skip(skip).limit(limit)

        const postArr = UserPost||null;

        res.status(200).send({message:'ok',postArr:postArr})
    }catch(error)
    {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

      })

      app.get('/getDiffProfilePost',auth,async(req,res)=>{
        try{
        let page=Number(req.query.page) || 1;
        let limit=Number(req.query.limit) || 3; 
        // console.log(page," ",req.query.page)
        let skip=(page-1)*limit;

        const id=req.query.diffId;
       
        

        const UserPost = await Post.find(
          {userId:id},
      ).skip(skip).limit(limit)

        const postArr = UserPost||null;

        res.status(200).send({message:'ok',postArr:postArr})
      }catch(error)
      {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }

      })



      app.get('/getProfileVid',auth,async(req,res)=>{
        try{
        let page=Number(req.query.page) || 1;
        let limit=Number(req.query.limit) || 3; 
        // console.log(page," ",req.query.page)
        let skip=(page-1)*limit;

        // const userUid = req.session.user?._id;
        
        // const id=userUid;
        const id=req.user.id;
       

        const UserPost = await Reel.find(
          {userId: id}
      ).skip(skip).limit(limit)

        const vidArr = UserPost||null;

        res.status(200).send({message:'ok',vidArr:vidArr})
        
      }catch(error)
      {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }

      })

      app.get('/getDiffProfileVid',auth,async(req,res)=>{
        try{
        let page=Number(req.query.page) || 1;
        let limit=Number(req.query.limit) || 3; 
        // console.log(page," ",req.query.page)
        let skip=(page-1)*limit;

        const id = req.query.diffId;

       
        //  const id="65ed3745d943316a9dfa74d5";

        const UserPost = await Reel.find(
          {userId: id}
      ).skip(skip).limit(limit)

        const vidArr = UserPost||null;

        res.status(200).send({message:'ok',vidArr:vidArr})
      }catch(error)
      {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      })


       app.get('/getProfileUser',auth,async(req,res)=>{
        try{
        // console.log(req.user.id)
        // const userUid = req.session.user?._id;
        const id=req.user.id;
        // const id=userUid;

        const profileData=await User.findById({_id:id},{name:1,posts:1,followers:1,following:1,privateOrPublic:1})

        res.status(200).send({message:'ok',profileData:profileData})
      }catch(error)
      {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }

       })

       
       app.get('/getDiffProfile',auth,async(req,res)=>{
        try{
        const id = req.query.diffId;
        // const uId=req.session.user?._id;
        const uId=req.user.id;
        const profileData=await User.findById({_id:id},{name:1,posts:1,followers:1,following:1,privateOrPublic:1})
        let friendOrNot;
        await User.findById(id)
           .then(user => {
        if (!user) {
            console.log('User not found');
            return;
        }

        if (user.friends.includes(uId)) {
            friendOrNot=true;
        } else {
          friendOrNot=false;
        }
    })
    .catch(error => {
        // Handle error
        console.error('Error finding user:', error);
    });

        res.status(200).send({message:'ok',profileData:profileData,friendOrNot:friendOrNot})
      }catch(error)
      {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
       })


      app.get('/reels-vid',auth,async(req,res)=>{
        try{
        // console.log("express-session",req.session.user)
        let page=Number(req.query.page) || 1;
        let limit=Number(req.query.limit) || 3; 

        let skip=(page-1)*limit;

        const UserPost = await Reel.find().skip(skip).limit(6)
 
        const vidArr = UserPost.map(post => {
          return {
              name: post.name,
              caption: post.caption,
              url: post.url,
              uplodeDate: post.uplodeDate,
              fileType: post.fileType,
              userId:post.userId,
              _id:post._id
          };
      }) || null;

      
        // const userIdToCheck = req.session.user?._id;
        const userIdToCheck=req.user.id;
        const likeCountValues = [];
        UserPost.forEach(post => {
  
              const likedByCurrentUser = post.likeCount.includes(userIdToCheck);
    
               likeCountValues.push(likedByCurrentUser);
          });
        

        res.status(200).send({message:'ok',vidArr:vidArr,likeCountValues:likeCountValues})
        
      }catch(error)
      {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      })

      app.get('/get-explore',auth,async(req,res)=>{
        try{
        let page=Number(req.query.page) || 1;
        let limit=Number(req.query.limit) || 5; 

        let skip=(page-1)*limit;
        
        const UserPost = await Reel.find({},{url:1,_id:1,userId:1,fileType:1},
      ).skip(skip).limit(5)

      const UserPost1 = await Post.find({},{url:1,_id:1,userId:1,fileType:1}
    ).skip(skip).limit(5)

        const expArr = shuffleArray(UserPost.concat(UserPost1));
        

        res.status(200).send({message:'ok',expArr:expArr})
        
      }catch(error)
      {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
        
      })

      app.get('/additionalData-img',auth,async(req,res)=>{
        try{
          // const userId=req.session.user?._id;
          const userId=req.user.id;
        const id=req.query?.id;
        const addiArr= await Post.findById(id)
        console.log(addiArr,addiArr.likeCount)
        const likedByCurrentUser = addiArr.likeCount.includes(userId);

        const addi = {
          ...addiArr.toObject(), // Spread the existing post properties
          isSameUser: addiArr.userId.toString() === userId.toString(), // Add the additional property
        };


        res.status(200).send({message:'ok',addiArr:addi,likedByCurrentUser:likedByCurrentUser})
      }catch(error)
      {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      })

      app.get('/additionalData-vid',auth,async(req,res)=>{
        
        try{
        const id=req.query?.id;
        // const userId=req.session.user?._id;
        const userId=req.user.id;
        const addiArr= await Reel.findById(id)
        const likedByCurrentUser = addiArr.likeCount.includes(userId);

        const addi = {
          ...addiArr.toObject(), // Spread the existing post properties
          isSameUser: addiArr.userId.toString() === userId.toString(), // Add the additional property
        };

        // console.log(addiArr)
        res.status(200).send({message:'ok',addiArr:addi,likedByCurrentUser:likedByCurrentUser})
      }catch(error)
      {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      })



      app.get('/get-users',auth,async(req,res)=>{
        try{
        const textPattern=req.query.data;
     
          const regexPattern = new RegExp('^' + textPattern);
      
          
          const results = await User.find({ name: { $regex: regexPattern } },{name:1}).limit(10);
      
          
          // console.log(results);
          res.status(200).send({message:'ok',results:results})
        }catch(error)
        {
          return res.status(401).json({ message: 'Invalid or expired token' });
        }
      })

      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const setPosts=async(id)=>{
      try {
        const result = await User.findOneAndUpdate(
            { _id: id }, 
            { $inc: { posts: 1 } }, 
            { new: true } 
        );
        console.log('Updated document:', result);
    } catch (error) {
        console.error('Error updating document:', error);
    }
    }

    app.get('/createFriends',auth, async (req, res) => {
      try{
      const friend_id = req.query.diffId;
      // const userId = req.session.user?._id;
      const userId = req.user.id;
  
     
          console.log('Friend ID:', friend_id);
          console.log('User ID:', userId);
  
          const user = await User.findById(userId);
          const friend = await User.findById(friend_id);
  
          console.log('User:', user);
          console.log('Friend:', friend);
  
          if (!user || !friend) {
              console.error('User or friend not found');
              return res.status(404).send('User or friend not found');
          }
  
          if (!user.friends) {
              user.friends = [];
          }
  
          if (!friend.friends) {
              friend.friends = [];
          }
  
          if (user.friends.includes(friend._id)) {
              return res.status(200).send('Friend already added');
          }


          // case 1 : friend id is public
          if(friend.privateOrPublic==='public')
          {
            user.friends.push(friend_id);
            // sent message to user and also add notification in user friend notifi area
          }else if(friend.privateOrPublic==='private')
          {
             // sent message that req is sent to user and and notifi his/her friend
          }

          
  
          // Add the friend's ID to the user's friends array
          
          // friend.friends.push(userId);
  
          // Save the updated user and friend documents
          await user.save();
          await friend.save();
  
          console.log('Friend added successfully');
          res.status(200).send('Friend added successfully');
        }catch(error)
        {
          return res.status(401).json({ message: 'Invalid or expired token' });
        }
  });
  
  app.get('/deleteFriends',auth, async(req, res) => {
    try{
    const friend_id = req.query.diffId;
    // const userId = req.session.user?._id;
    const userId=req.user.id;
    

        
        const user = await User.findById(userId);
        const friend = await User.findById(friend_id);

        if (!user || !friend) {
            console.error('User or friend not found');
            return res.status(404).send('User or friend not found');
        }
        
     
        if (!user.friends) {
            user.friends = [];
        }

        if (!friend.friends) {
            friend.friends = [];
        }

        if (!user.friends.includes(friend._id)) {
          return res.status(200).send('Friend is not exist');
      }

        // Remove userId from friend's friends array
        user.friends = user.friends.filter(friendId => friendId.toString() !== friend_id);

        // Remove userId from friend's friends array
        friend.friends = friend.friends.filter(friendId => friendId.toString() !== userId);




        // Save the updated user and friend documents
        await user.save();
        await friend.save();

        console.log('Friend removed successfully');
        res.status(200).send('Friend removed successfully');
      }catch(error)
      {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
});

    app.get('/getFriends',auth,async(req,res)=>{
       try{
      // const userId=req.session.user?._id;
      const userId=req.user.id;
      
       
        const user = await User.findById(userId).select('friends');
        if (!user) {
            return res.status(404).send('User not found');
        }

       
        const friendsInfo = [];
        for (const friendId of user.friends) {
            const friend = await User.findById(friendId).select('name isOnline _id');
            if (friend) {
                friendsInfo.push(friend);
            }
        }

        res.status(200).send({ friendsArr: friendsInfo });
      }catch(error)
      {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }


    })

app.post('/saveChats',auth,async(req,res)=>{
    try {
      let chat=new Chat({
        sender_id:req.body.sender_id,
         receiver_id:req.body.receiver_id,
         messages:req.body.msg
      })

      await chat.save();
      res.status(200).send({success:true,data:'chats inserted!',msg:req.body.msg,myId:req.body.sender_id,friendId:req.body.receiver_id})
    }catch(error)
    {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
})

app.get('/Like-img',auth,async(req,res)=>{
  try{
    const id=req.query.id;
    const mark=req.query.mark;
    // const userId=req.session.user?._id;
    const userId=req.user.id;
    // console.log(id," id ",mark," mark ",userId)

         const reel=await Post.findById(id);
         if(!reel.likeCount.includes(userId))
         {
          reel.likeCount.push(userId);
          await reel.save(); 
         }
         res.status(200).send({success:true})
        }catch(error)
        {
          return res.status(401).json({ message: 'Invalid or expired token' });
        }

})


app.get('/UnLike-img',auth,async(req,res)=>{
  try{
    const id=req.query.id;
    const mark=req.query.mark;
    // const userId=req.session.user?._id;
    const userId=req.user.id;
    // console.log(id," id ",mark," mark ",userId)

         const reel=await Post.findById(id);
         if(reel.likeCount.includes(userId))
       {
        const userIndex = reel.likeCount.indexOf(userId);
        if (userIndex !== -1) {
            reel.likeCount.splice(userIndex, 1);
            await reel.save();    
        }
      }
         res.status(200).send({success:true})
        }catch(error)
        {
          return res.status(401).json({ message: 'Invalid or expired token' });
        }

})

app.get('/Like-vid',auth,async(req,res)=>{
  try{
    const id=req.query.id;
    const mark=req.query.mark;
    // const userId=req.session.user?._id;.
    const userId=req.user.id;
    // console.log(id," id ",mark," mark ",userId)

         const reel=await Reel.findById(id);
         if(!reel.likeCount.includes(userId))
         {
          reel.likeCount.push(userId);
          await reel.save(); 
         }
         res.status(200).send({success:true})
        }catch(error)
        {
          return res.status(401).json({ message: 'Invalid or expired token' });
        }

})


app.get('/UnLike-vid',auth,async(req,res)=>{
  try{
    const id=req.query.id;
    const mark=req.query.mark;
    // const userId=req.session.user?._id;
    const userId=req.user.id;
    // console.log(id," id ",mark," mark ",userId)

         const reel=await Reel.findById(id);
         if(reel.likeCount.includes(userId))
       {
        const userIndex = reel.likeCount.indexOf(userId);
        if (userIndex !== -1) {
            reel.likeCount.splice(userIndex, 1);
            await reel.save();    
        }
      }
         res.status(200).send({success:true})
        }catch(error)
        {
          return res.status(401).json({ message: 'Invalid or expired token' });
        }

})


app.post('/comment', upload.none(),auth,async(req,res)=>{
  try{
    // const userId=req.session.user?._id;
    const userId=req.user.id;
    // console.log(req)
    const postId=req.body.id;
    // console.log(req.body)
    const comment={
      comment:req.body.cmtText,
      postedBy:userId
    }
    
    const userData=await getNameAndMail(userId)
    
    const result=await Reel.findByIdAndUpdate(postId,{
      $push:{comments:comment}
    },{
      new:true
    })
    // console.log(result)
    res.status(200).send({comment:comment.comment,postedBy:comment.postedBy,name:userData.name})
    // res.status(200).send({comment:comment.comment,postedBy:comment.postedBy})
  }catch(error)
  {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
})

app.post('/comment-post', upload.none(),auth,async(req,res)=>{
  try{
    // const userId=req.session.user?._id;
    console.log(req.user.id)
    const userId=req.user.id;
    // console.log(req)
    const postId=req.body.id;
    // console.log(req.body)
    const comment={
      comment:req.body.cmtText,
      postedBy:userId
    }

    const userData=await getNameAndMail(userId)

    const result=await Post.findByIdAndUpdate(postId,{
      $push:{comments:comment}
    },{
      new:true
    })
    // console.log(result)
    res.status(200).send({comment:comment.comment,postedBy:comment.postedBy,name:userData.name})
    
  }catch(error)
  {
    console.log(error)
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
})



app.get('/getCommentsPost',auth,async(req,res)=>{
  try {
    let page = Number(req.query.page) || 1;
    let limit = 20;

    let skip = (page-1)*limit;

    // if (page > 1) {
    //     skip = (page - 1) * limit;
    // }

    const id = req.query.id;

    const cmtArr = [];

    const reels = await Post.findById(id).lean();
    console.log(reels,id)

    const totalComments = reels.comments.length;
    
    // let commentsProcessed = reels.comments.length-1;

    for (let i = reels.comments.length - 1; i >= 0; i--) {
        const comment = reels.comments[i];

        if (skip>0) {
            skip--;
            continue;
        }

        if (limit === 0) {
            break;
        }

        limit = limit - 1;
        const user = await User.findById(comment.postedBy);
        const userName = user ? user.name : 'Unknown';
        cmtArr.push({ comment: comment.comment, postedBy: comment.postedBy, name: userName });
    }

    res.status(200).send({ cmtArr, totalComments });
  }catch(error)
  {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
})


app.get('/getComments',auth,async(req,res)=>{
  try {
    let page = Number(req.query.page) || 1;
    let limit = 20;

    let skip = (page-1)*limit;

    // if (page > 1) {
    //     skip = (page - 1) * limit;
    // }

    const id = req.query.id;

    const cmtArr = [];

    const reels = await Reel.findById(id).lean();
    

    const totalComments = reels.comments.length;

    // let commentsProcessed = reels.comments.length-1;

    for (let i = reels.comments.length - 1; i >= 0; i--) {
        const comment = reels.comments[i];

        if (skip>0) {
            skip--;
            continue;
        }

        if (limit === 0) {
            break;
        }

        limit = limit - 1;
        const user = await User.findById(comment.postedBy);
        const userName = user ? user.name : 'Unknown';
        cmtArr.push({ comment: comment.comment, postedBy: comment.postedBy, name: userName });
    }

    res.status(200).send({ cmtArr, totalComments });
}catch(error)
    {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

})


app.get('/changePrivateorPublic',auth,async(req,res)=>{
  try{
    // const userId=req.session.user?._id;
    const userId=req.user.id;
    const data=req.query.privateOrPublic

   await User.findByIdAndUpdate(userId, { privateOrPublic: data }, { new: true })
  .then(updatedUser => {
    console.log(updatedUser);
    res.status(200).send({message:'updated privateOrPublic'})
  })
  .catch(error => {
    console.error('Error updating user:', error);
    res.status(400).send({message:'Error'})
  });

}catch(error)
{
  return res.status(401).json({ message: 'Invalid or expired token' });
}
})


// sokects




// io.on('connection',async(socket)=>{
//      console.log("Socket id : ",socket.id)

//      const UserId=socket.handshake.auth.token;
//      console.log(UserId," new id")
//      if(UserId){
//      await User.findByIdAndUpdate({_id:UserId},{$set:{isOnline:1}});
//      socket.broadcast.emit('getOnlineUser',{user_id:UserId})
//      }
      
    

//      socket.on('disconnect',async()=>{
//       console.log(`user disconnected: ${socket.id}`);
//       const UserId=socket.handshake.auth.token;
//       console.log("dis id ",UserId)
//       if(UserId){
//         await User.findByIdAndUpdate({_id:UserId},{$set:{isOnline:0}});
//         socket.broadcast.emit('getOfflineUser',{user_id:UserId})
//       }
//      })

//      socket.on('newChats',(data)=>{
//              socket.broadcast.emit('loadNewChats',data);
//      })

//      socket.on('existChats',async(data)=>{
//       // console.log(data)
//       const chats = await Chat.find({
//         $or: [
//           { sender_id: data.sender_id, receiver_id: data.receiver_id },
//           { sender_id: data.receiver_id, receiver_id: data.sender_id }
//         ]
//       });
      
//         //  console.log(chats)

//          socket.emit('loadExistChats',{chats:chats})
//      })
// })

// Server.listen(PORT1,()=>{console.log("Server is running ",PORT1)})
const server = app.listen(PORT,()=>{console.log("Server is running ",PORT)})

const io = require('socket.io')(server,{
  pingTimeout:60000,
  cors:{
    origin:`${process.env.FRONT_URL}`
}
})

io.on('connection',async(socket)=>{
  console.log("Socket id : ",socket.id)

  const UserId=socket.handshake.auth.token;
  console.log(UserId," new id")
  if(UserId){
  await User.findByIdAndUpdate({_id:UserId},{$set:{isOnline:1}});
  socket.broadcast.emit('getOnlineUser',{user_id:UserId})
  }
   
 

  socket.on('disconnect',async()=>{

   console.log(`user disconnected: ${socket.id}`);
   const UserId=socket.handshake.auth.token;
   console.log("dis id ",UserId)
   if(UserId){
     await User.findByIdAndUpdate({_id:UserId},{$set:{isOnline:0}});
     socket.broadcast.emit('getOfflineUser',{user_id:UserId})
   }
  })

  socket.on('newChats',(data)=>{
          socket.broadcast.emit('loadNewChats',data);
  })

  socket.on('existChats',async(data)=>{
   // console.log(data)
   const chats = await Chat.find({
     $or: [
       { sender_id: data.sender_id, receiver_id: data.receiver_id },
       { sender_id: data.receiver_id, receiver_id: data.sender_id }
     ]
   });


   
   
     //  console.log(chats)

      socket.emit('loadExistChats',{chats:chats})
  })
})