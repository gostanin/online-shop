const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    res.render('admin/add-product', {title: 'Add product', path: '/admin/add-product'});
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title, req.body.price, req.body.description, req.body.imageUrl);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => res.render('admin/product-list', { products: products, title: 'All products', path: '/admin/products' }));
}