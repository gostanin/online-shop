const path = require('path');
const express = require('express');
const rootDir = require('../utils/path');

const router = express.Router();
const adminData = require('./admin');

// use not getting exact matching, but get/post matches exactly
router.get('/', (req, res, next) => {
    const products = adminData.products;
    res.render('shop', {products: products, title: 'Shop', path: '/'});
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
});


module.exports = router;