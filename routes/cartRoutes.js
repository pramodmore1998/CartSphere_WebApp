import express from 'express'
import { requireSignIn } from '../middlewares/authMiddleware.js';
import { addToCartController, getCartController, removeFromCartController, updateCartQuantityController } from '../controller/cartController.js';
const router= express.Router();


router.post('/add', requireSignIn, addToCartController);

router.get('/get', requireSignIn, getCartController);

router.delete('/remove/:pid',requireSignIn, removeFromCartController );

router.put("/update", requireSignIn, updateCartQuantityController);

export default router;