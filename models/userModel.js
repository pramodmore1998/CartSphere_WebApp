import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        // trim:true //for remove white spaces 
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
    },
cart: [
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
    quantity: { type: Number, default: 1 }
  }
],

    // question:{
    //     type:String,
    //     required:true
    // },
    role:{
        type:Number,
        default:0
    }
}, {timestamps:true})

export default mongoose.model('users', userSchema); 