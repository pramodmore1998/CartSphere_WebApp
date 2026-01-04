import express from 'express'
const router= express.Router();
import {requireSignIn, isAdmin} from '../middlewares/authMiddleware.js'
import  {categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController} from '../controller/categoryController.js';

//Routes...
//create category (Admin only)
router.post('/create-category', requireSignIn, isAdmin, createCategoryController);

//Update category (Admin only)
router.put('/update-category/:id',requireSignIn, isAdmin, updateCategoryController);

//get All category
router.get('/get-category', categoryController)

//Single category
router.get('/single-category/:slug', singleCategoryController)

//delete category
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController)


export default router;