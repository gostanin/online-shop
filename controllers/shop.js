const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => res.render('shop/product-list', { products: products, title: 'All products', path: '/products' }));
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => res.render('shop/index', { products: products, title: 'Shop', path: '/' }));
};

exports.getCart = (req, res, next) => {
    res.render('shop/cart', { path: '/cart', title: 'Your Cart' });
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {path: '/checkout', title: 'Checkout'});
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {path: '/orders', title: 'Orders'});
}