import express from 'express'
import {forgotPasswordController, getAllOrdersController, getOrdersController, loginController, logoutController, registerController, updateProfileController, orderStatusController} from '../controller/authController.js'
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';
import userModel from '../models/userModel.js';
import mongoose from 'mongoose';
//router object 
const router = express.Router(); 

//routing 

//register 
router.post('/register', registerController)

//login 
router.post('/login', loginController)

//Forgot password   
router.post('/forgot-password', forgotPasswordController)


//Protected auth route
router.get('/user-auth', requireSignIn, async (req,res)=>{
    try{
        const user= await userModel.findById(req.decodeUser._id).select("-password");
        
    if(!user){
        return res.status(401).send({
            ok:false,
            msg:"user not found",
            user:user,
        })
    }
    
    res.status(200).send({
            ok:true,
            user:user,
      
           
        })
    }
    catch(err){
        res.status(500).send({
            ok:false,   
            msg:"server error"
        })
    }
    
})
 
//admin route
router.get('/admin-auth', requireSignIn, isAdmin, async (req,res)=>{
    const user= await userModel.findById(req.decodeUser._id)

    res.status(200).send({
        ok:true,
        success:true,
        msg:"Welcome admin",
        user:user
    }) 
   
} )

//logout 

router.get('/logout', logoutController );

//update profile
router.put('/profile', requireSignIn, updateProfileController)

//Orders
router.get('/orders', requireSignIn, getOrdersController)

//All Orders (for admin only)
router.get('/all-orders', requireSignIn, isAdmin,  getAllOrdersController)

//Order Status update (for admin only)
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController)

export default router;    