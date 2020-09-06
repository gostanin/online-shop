const path = require('path');
const express = require('express');

const productsController = require('../controllers/products');


const router = express.Router();

// use not getting exact matching, but get/post matches exactly
router.get('/', productsController.getProducts);

module.exports = router;