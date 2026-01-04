import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

//Protected route token base
export const requireSignIn=async(req,res,next)=>{
    try{
        const token = req.cookies.authToken; 
        const decode = jwt.verify(token, process.env.JWT_SECRET)    
        if(!decode){
            return res.send({success:false, msg:"token incorrect"});
        }
        req.decodeUser=decode; 
        next();
        
    } 
    catch(err){
        return res.status(401).send({
            success:false,
            msg:"invalid token"
        })
    }
}

//Admin access 
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.decodeUser || !req.decodeUser._id) {
      return res.status(401).send({
        success: false,
        msg: "Unauthorized: token missing",
      });
    }

    const user = await userModel.findById(req.decodeUser._id);

    if (!user) {
      return res.status(401).send({
        success: false,
        msg: "User not found",
      });
    }

    if (user.role !== 1) {
      return res.status(403).send({
        success: false,
        msg: "Admin access denied",
      });
    }

    next();
  } catch (err) {
    res.status(500).send({
      success: false,
      msg: "Error in admin middleware",
    });
  }
};
