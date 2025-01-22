// const jwt =require('jsonwebtoken')

// const auth=(req,res,next)=>{

//     console.log(req.cookies);
//     const {token}=req.cookies;

//     //if no token , stop there

//     if(!token)
//     {
//         res.status(403).send('Please login first');
//     }

    


//     try {
//         const decode =jwt.verify(token,process.env.JWT_SECRET);
//         // console.log(decode)
//         req.user=decode
//         console.log(req.user,"hello")
        
//     } catch (error) {
//         console.log(error)
//         res.status(401).send('Invalid Token')
//     } 



//     return next()

// }

// module.exports=auth.


const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  console.log(req.cookies);
  const { token } = req.cookies;

  // If no token, stop there
  if (!token) {
    return res.status(403).send('Please login first');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user info to the request object
    console.log(req.user, "User authenticated");
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in auth middleware:", error);
    return res.status(401).send('Invalid Token');
  }
};

module.exports = auth;
