const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {title: 'Add product', path: '/admin/add-product', editing: false});
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const id = req.params.id;
    Product.findById(id, product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {title: 'Edit product', path: '/admin/edit-product', editing: editMode, product: product});
    })
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title, req.body.price, req.body.description, req.body.imageUrl);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => res.render('admin/product-list', { products: products, title: 'All products', path: '/admin/products' }));
}