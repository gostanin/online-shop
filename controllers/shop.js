const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/product-list', { products: products, title: 'All products', path: '/products' })
        })
        .catch(error => console.log(error));
};

exports.getProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findByPk(id)
        .then(product => {
            res.render('shop/product-detail', { path: '/products', title: 'Details', product: product });
        })
        .catch(error => console.log(error));

};

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index', { products: products, title: 'Shop', path: '/' })
        })
        .catch(error => console.log(error));

};

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
                .then(products => {
                    res.render('shop/cart', { path: '/cart', title: 'Your Cart', products: products })
                });
        })
        .catch(error => console.log(error));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.id;
    let fetchedCart;
    let newQuantity;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } })
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0]
            }
            newQuantity = 1
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product
            }
            return Product.findByPk(prodId)
        })
        .then(product => {
            return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
        })
        .then(res.redirect('/'))
        .catch(error => console.log(error));
};

exports.deleteCartItem = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: req.body.id } });
        })
        .then(products => {
            products[0].cartItem.destroy();
        })
        .then(res.redirect('/cart'))
        .catch(error => console.log(error));
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', { path: '/checkout', title: 'Checkout' });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', { path: '/orders', title: 'Orders' });
};