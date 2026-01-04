import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

//Create Category (Admin Only)...
export const createCategoryController=async (req,res)=>{
    try{
        const{name}=req.body;
        if(!name){
            return res.status(401).send({msg:"name is requried"})
        }
        const existingCategory=await categoryModel.findOne({name});
        if(existingCategory){
            return res.status(201).send({success:false, msg:"category already exist"})
        }
        const category = await new categoryModel({name, slug:slugify(name)}).save();
        res.status(201).send({success:true, msg:"new category created", category})
    }
    catch(err){
        console.log(err);
        res.status(400).send({
            success:false,
            err,
            msg:"error in category"
        })
        
    }
}

//Update Category(Admin Only)...
export const updateCategoryController=async(req,res)=>{
    try{
        const {name} = req.body;
        const {id}=req.params;
        const category =await categoryModel.findByIdAndUpdate(id,{name, slug:slugify(name)},{new:true}) //id chya base var update find karayach ahe, {name}->Name update karaych ahe, new is object new:true nahi kel tar category page update nahi honar.
        res.status(200).send({success:true,msg:"category updated...", category})
    }
    catch(err){
        console.log(err);
        res.status(500).send({success:false, err, msg:"Error while updating category"})
        
    }
}

//get All category controller
export const categoryController=async(req,res)=>{
    try{
        const category= await categoryModel.find({});
        res.status(200).send({success:true, msg:"All categories list", category});
    }
    catch(err){
        console.log(err);
        res.status(500).send({success:false, err, msg:"Error while getting all categories..."})
        
    }
}

//Single category controller 
export const singleCategoryController=async(req,res)=>{
    try{
        const {slug}=req.params;
        const category= await categoryModel.findOne({slug:slug});
        res.status(200).send({success:true, msg:"get single category successfully", category})
    }
    catch(err){
        console.log(err);
        res.status(500).send({success:false, err, msg:"error while getting single category"})
        
    }
}

//deleteCategoryController
export const deleteCategoryController =async (req,res)=>{
    try{
        const {id}=req.params;
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({success:true, msg:"category delted..."})

    }
    catch(err){
        console.log(err);
        res.status(500).send({success:false, err, msg:"error while delete category"})
        
    }
}

