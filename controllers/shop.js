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
    Cart.getProducts(cart => Product.fetchAll()
        .then(([products, fieldData]) => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                console.log(cartProductData);
                if (cartProductData) {
                    productQty = cartProductData.qty;
                    price = product.price;
                    cartProducts.push({ product: product, qty: productQty, price: price * productQty });
                }
            }
            console.log(cartProducts);
            res.render('shop/cart', { path: '/cart', title: 'Your Cart', cart: cartProducts })
        }));
};

exports.postCart = (req, res, next) => {
    console.log(req.body.id);
    Product.findById(req.body.id)
        .then(([products, fieldData]) => { 
            product = products[0]
            console.log('findbyID results', product)
            Cart.addProduct(product.id, product.price)})
        .catch(error => console.log(error));

    res.redirect('/');
};

exports.deleteCartItem = (req, res, next) => {
    Product.findById(req.body.id)
        .then(([products, fieldData]) => {
            product = products[0]
            Cart.deleteProduct(product.id, product.price)
        })
        .catch(error => console.log(error));
    res.redirect('/cart');
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', { path: '/checkout', title: 'Checkout' });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', { path: '/orders', title: 'Orders' });
};