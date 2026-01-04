
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';

export const registerController=async(req,res)=>{
    try{
        const {name, email, password, phone , address}= req.body;
        //validation 
        if(!name || !email || !password || !phone || !address){
            return res.send({success:false , msg:"All fields is required"})
        }

        //Check existing user 
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.status(200).send({
                success:false,
                msg:"Already register please login..."
            })
        }
        //Register new user after cheking existing uer 
        const hashedPassword=await hashPassword(password);  

        const user = await userModel.create(
            {name,email, password:hashedPassword, phone,address}  
          );
          return res.status(201).send({
            success:true,
            msg:"user register successfully",
            user:user
          })
    }
    catch(err){
        console.log(err);
       return res.status(500).send({success:false, msg:'Error in register'})
        
    }
};

//Login (POST)
export const loginController=async(req,res)=>{
    try{
        const {email, password} = req.body; 

        //valiation 
        if(!email || !password){
            return res.status(404).send({
                success:false,
                msg:"All fields mandetory"
            })
        }
        //Check user
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                msg:"email is not registered pls signup"
            })
        }
   
        const matchPassword=await comparePassword(password, user.password)
        if(!matchPassword){
           return res.status(200).send({
                success:false,
                msg:"invalid password"
            })
        }
        //token creation    
        const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn:'1d'});
    
         res.cookie('authToken', token, {
            httpOnly:true,
            secure:true,
            sameSite:"None",
            maxAge:7*24*60*60*10000
        })

        res.status(200).
        send(
            {success:true, 
             msg:"Login success",
             token:token,
             user:{name:user.name, email:user.email, phone:user.phone, address:user.address, role:user.role},
          
            })
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            msg:"error in login",
            err
        })    
    }
}

//Logout Controller
export const logoutController=async (req,res)=>{
    try{
       await res.clearCookie("authToken", {
        httpOnly:true,
        secure:true,
        sameSite:'None', 
    })
     res.status(201).send({
        success:true,
        msg:"logout sucess..."
     })
    }
    catch(err){
        console.log(err);
        
    }
}

//forgotPasswordController
export const forgotPasswordController=()=>{
    try{
        
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            msg:"something went wrong",
            err
        })
        
    }
}

//Update profile
export const updateProfileController=async(req,res)=>{
    try{
        const {name, password, phone, address }= req.body;
        const user= await userModel.findById(req.decodeUser._id);

        //password check
        if(password && password.length < 6 ){
            return res.json({error:"Password is required and 6 character long"})
        }
        const hashedPassword = password?await hashPassword(password) :"";
        const updatedUser=await userModel.findByIdAndUpdate(req.decodeUser._id, {name:name || user.name,
            password:hashedPassword || user.password,
            phone:phone || user.phone,
            address:address || user.address
        }, {new:true})
        res.status(200).send({
            success:true,
            msg:"Profile updated",
            updatedUser
        })
    }
    catch(err){
        res.status(500).send({
            success:false,
            msg:"something went wrong",
            err: err
        })
    }
}

// Get Orders for logged-in user
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.decodeUser._id })
      .populate("buyer", "name phone address email") // buyer info
      .populate("products.product", "productName description price"); // product info

    res.json(orders);
  } catch (err) {
    res.status(500).send({
      success: false,
      msg: "Error while getting orders",
      err,
    });
  }
};



export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .sort({ createdAt: -1 }) //-1 for latest order
      .populate("buyer", "name email phone") // buyer info
      .populate("products.product", "productName description price")// product info
    res.json(orders);

  } catch (err) {
    res.status(500).send({
      success: false,
      msg: "Error while getting orders",
      err,
    });
  }
};

//Order status controlls (For admin only)
export const orderStatusController=async(req,res)=>{
    try{
        const {orderId} = req.params
        const {status}=req.body 
        const orders = await orderModel.findByIdAndUpdate(orderId, {status}, {new:true})
        res.json(orders)
    }
    catch(err){
    res.status(500).send({
      success: false,
      msg: "Error while updating order ",
      err,
    });
    }
}