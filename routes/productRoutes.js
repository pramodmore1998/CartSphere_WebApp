import express from 'express';
import formidable from 'express-formidable';  //image library
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { brainTreePaymentController,  braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProduct, productCategoryController, productCountController, productFilterController, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController } from '../controller/productController.js';

const router=express.Router(); 

//routes
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController); //formidable used for image 

//get all products
router.get('/get-product', getProductController)

//get single product
router.get('/get-product/:slug', getSingleProduct)



//get photo
router.get('/product-photo/:pid', productPhotoController)

//delete product
router.delete('/delete-product/:pid', deleteProductController)

//update product
router.put('/update-product/:pid', requireSignIn, isAdmin,formidable(), updateProductController);

//Filter products...
router.post('/product-filter', productFilterController);

//Product count
router.get('/product-count', productCountController);

//product per page
router.get('/product-list/:page', productListController);

//Serach Product route
router.get('/search/:keyword', searchProductController);

//Similar Products
router.get('/related-product/:pid/:cid', relatedProductController)


//Category wise product 
router.get('/product-category/:slug', productCategoryController)

//Payement routes
//token
router.get('/braintree/token', braintreeTokenController)

//payments
router.post('/braintree/payment', requireSignIn, brainTreePaymentController)

export default router;