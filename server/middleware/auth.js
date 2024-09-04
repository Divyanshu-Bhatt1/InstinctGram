const jwt =require('jsonwebtoken')

const auth=(req,res,next)=>{

    console.log(req.cookies);
    const {token}=req.cookies;

    //if no token , stop there

    if(!token)
    {
        res.status(403).send('Please login first');
    }

    


    try {
        const decode =jwt.verify(token,process.env.JWT_SECRET);
        // console.log(decode)
        req.user=decode
        console.log(req.user,"hello")
        
    } catch (error) {
        console.log(error)
        res.status(401).send('Invalid Token')
    } 



    return next()

}

module.exports=auth