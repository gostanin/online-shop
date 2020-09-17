const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => res.render('shop/product-list', { products: products, title: 'All products', path: '/products' }));
};

exports.getProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id, product => {
        res.render('shop/product-detail', { path: '/products', title: 'Details', product: product });
    })

}

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => res.render('shop/index', { products: products, title: 'Shop', path: '/' }));
};

exports.getCart = (req, res, next) => {
    Cart.getProducts(cart => Product.fetchAll(products => {
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
}

exports.postCart = (req, res, next) => {
    console.log(req.body.id);
    Product.findById(req.body.id, product => Cart.addProduct(product.id, product.price));
    res.redirect('/');
}

exports.deleteCartItem = (req, res, next) => {
    Product.findById(req.body.id, product => Cart.deleteProduct(product.id, product.price))
    res.redirect('/cart');
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', { path: '/checkout', title: 'Checkout' });
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', { path: '/orders', title: 'Orders' });
}