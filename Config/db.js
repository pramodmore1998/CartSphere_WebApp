import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        const conn= await mongoose.connect(process.env.MONGOURL)  
    }
    catch(err){
        throw("error in database")
        
    }  
}

export default connectDB; 