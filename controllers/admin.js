const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', { title: 'Add product', path: '/admin/add-product', editing: false });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const id = req.params.id;
    Product.findById(id)
        .then(([products, fieldData]) => {
            if (!products) {
                return res.redirect('/');
            }
            product = products[0];
            res.render('admin/edit-product', { title: 'Edit product', path: '/admin/edit-product', editing: editMode, product: product });
        })
        .catch(error => console.log(error));
};

exports.postEditProduct = (req, res, next) => {
    const product = new Product(req.body.id, req.body.title, req.body.price, req.body.description, req.body.imageUrl);
    product.save().catch(error => console.log(error));
    res.redirect('/admin/products');
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(null, req.body.title, req.body.price, req.body.description, req.body.imageUrl);
    product.save().catch(error => console.log(error));
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([products, fieldData]) => res.render('admin/product-list', { products: products, title: 'All products', path: '/admin/products' }));
}

exports.deleteProduct = (req, res, next) => {
    const id = req.body.id;
    Product.delete(id);
    res.redirect('/admin/products');
}