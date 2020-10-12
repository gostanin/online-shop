const express = require('express');

const productsController = require('../controllers/shop');

const router = express.Router();

// use not getting exact matching, but get/post matches exactly
router.get('/', productsController.getIndex);

router.get('/products', productsController.getProducts);

router.get('/products/:id', productsController.getProduct); // order sensetive product/delete after this route wouldn't be executed

router.get('/cart', productsController.getCart);

router.post('/cart', productsController.postCart);

router.post('/cart-delete-item', productsController.deleteCartItem);

router.get('/checkout', productsController.getCheckout);

router.get('/orders', productsController.getOrders);

router.post('/create-order', productsController.postOrder);


module.exports = router;