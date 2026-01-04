import slugify from "slugify";
import dotenv from 'dotenv'
dotenv.config();
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import fs from 'fs'; //file system
import braintree from "braintree";


//Payment Getway   
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


export const createProductController=async(req,res)=>{
    try{
        const {productName, description,price, category}= req.fields;
        const {photo}=req.files;
        //validation
        switch(true){
            case !productName:
                return res.status(400).send({error:"Name is required"}) 
            case !description:
                return res.status(400).send({error:"description is required"})
            case !price:
                return res.status(400).send({error:"price is required"})
            case !category:
                return res.status(400).send({error:"category is required"});
            case !photo:
                return res.status(400).send({error:"photo is required"});
            case photo:
                return res.status(400).send({error:"photo should be less than 1mb"})    
        }

        const products = new productModel({...req.fields, slug:slugify(productName)})
        if(photo){
            products.photo.data=fs.readFileSync(photo.path);
            products.photo.contentType=photo.type
        }
        await products.save();
        res.status(201).send({success:true, msg:"product created successfully", products})
    }
    catch(err){
        res.status(500).send({success:false, msg:"create product failed...", err:err})
        console.log(err);
        
    }
}

//get all products
export const getProductController=async(req,res)=>{
    try{
        const products=await productModel.find({}).select("-photo").limit(12).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            Total_Products:products.length,
            msg:"All products", 
            products:products
        })
    }
    catch(err){
        console.log(err);
        res.status(500).send({success:false, msg:"error in getting product", err})
        
    }
}

//get single product
export const getSingleProduct=async(req,res)=>{
    try{
        const {slug}=req.params; 
        const singleProduct=  await productModel.findOne({slug});
        if(singleProduct){
            res.status(200).send({success:true, msg:"product find success", singleProduct})
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send({success:false, msg:"error in getting single product", err})

    }
}

//productPhotoController
export const productPhotoController=async(req,res)=>{
    try{ 
        const product=  await productModel.findById(req.params.pid).select("photo");
        if(product.photo.data){
            res.set('Content-type', product.photo.contentType);
            res.status(200).send(product.photo.data)
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send({success:false, msg:"error in getting product photo", err})

    }
}

// delete product controller
export const deleteProductController=async(req,res)=>{
    try{ 
        const {pid}=req.params;
        await productModel.findByIdAndDelete(pid);

        res.status(200).send({success:true, msg:"product deleted"})
        
    }
    catch(err){
        console.log(err);
        res.status(500).send({success:false, msg:"error in deleting product", err})

    }
}

//update product controller
//photo required validation is not required for update product
export const updateProductController=async(req,res)=>{
    try{
        const {productName, description,price, category}= req.fields;
        const {photo}=req.files;
        //validation
        switch(true){
            case !productName:
                return res.status(500).send({error:"Name is required"}) 
            case !description:
                return res.status(500).send({error:"description is required"})
            case !price:
                return res.status(500).send({error:"price is required"})
            case !category:
                return res.status(500).send({error:"category is required"});
            // case !photo:
            //     return res.status(500).send({error:"photo is required"});
            // case !photo && photo.size>1000000:
            //     return res.status(500).send({error:"photo should be less than 1mb"})    
        }

        const products = await productModel.findByIdAndUpdate(req.params.pid, {...req.fields, slug:slugify(productName)}, {new:true})
        if(photo){
            products.photo.data=fs.readFileSync(photo.path);
            products.photo.contentType=photo.type;
          
        }
          await products.save();
       
        res.status(201).send({success:true, msg:"product updated successfully", products})
    }
    catch(err){
        res.status(500).send({success:false, msg:"update product failed...", err:err})
    }
}

//Filter product
export const productFilterController=async(req,res)=>{
    try{
        const {checked, radio} = req.body;
        let args={};
        if(checked.length>0){
            args.category=checked;
        }
        if(radio.length){
            args.price={$gte:radio[0], $lte:radio[1]}
        }
        const products=await productModel.find(args);
        res.status(200).send({success:true, products})
    }
    catch(err){
        console.log(err);
        res.status(400).send({success:false, msg:"Error while filtering "})
        
    }
}

//Product count controller
export const productCountController=async(req,res)=>{
    try{
        const  total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success:true,
            total
        })
    }
    catch(err){
        res.status(400).send({success:false, msg:"Error in product count "})
    }
}

// product List Controller
export const productListController=async(req,res)=>{
    try{
        const perPage=6;
        const page=req.params.page? req.params.page : 1;
        const products= await productModel.find({}).select("-photo").skip((page-1) * perPage).limit(perPage).sort({createdAt: -1});

        res.status(200).send({success:true, products})
    }
    catch(err){
        res.status(400).send({success:false, msg:"Error in per page"})
    }
}

//Serach Product Controller 
export const searchProductController=async(req,res)=>{
    try{
        const {keyword} = req.params;
        const result  =await productModel.find({
            $or:[
                {name:       {$regex:keyword, $options:"i"}},
                {description:{$regex:keyword, $options:"i"}}
            ]
        }).select("-photo");
        res.json(result)
    }
    catch(err){
          res.status(400).send({success:false, msg:"Error in searching"});

    }
}

//similar product 
export const relatedProductController=async()=>{
    try{
        const {pid, cid} =req.params;
        const products= await productModel.find({
            category:cid,
            _id:{$ne:pid}          //$ne meanse not included
        }).select('-photo').limit(3).populate("category");
        res.status(200).send({
            success:true,
            products
        })
    }
     catch(err){
          res.status(400).send({success:false, msg:"Error in similar products"});

    }
}

//get product by category (productCategoryController)
export const productCategoryController=async(req,res)=>{
    try{
        const category = await categoryModel.findOne({slug:req.params.slug})
        const products= await productModel.find({category}).populate('category');
        res.status(200).send({
            success:true,
            category,
            products
        })
    }
    catch(err){
         res.status(500).send({success:false, err, msg:"error while getting product"})
    }
}

//Payment getway API
//Token
export const braintreeTokenController = async (req, res) => {
  try {
 
    gateway.clientToken.generate({}, function(err, response){
      if (err) {
        return res.status(500).send(err);
      }
       else{
        res.json({ clientToken: response.clientToken });
       }
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Braintree token error");
  }
};



//payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;

    // Ensure cart has proper structure
    const productsForOrder = cart.map(item => ({
      product: item.product._id || item.product, // in case frontend sends id directly
      quantity: item.quantity || 1,
      price: item.product.price || 0
    }));

    // Total amount
    const total = productsForOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create Braintree transaction
    gateway.transaction.sale(
      {
        amount: total.toFixed(2),
        paymentMethodNonce: nonce,
        options: { submitForSettlement: true }
      },
      async (error, result) => {
        if (result) {
          // Save order
          await new orderModel({
            products: productsForOrder,
            payment: result,
            buyer: req.decodeUser._id,
            status: "Not Process"
          }).save();

          // Clear user cart in DB
          await userModel.findByIdAndUpdate(req.decodeUser._id, { cart: [] });

          res.json({ ok: true, total });
        } else {
          console.log("BRAINTREE ERROR:", error);
          res.status(500).send(error);
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
