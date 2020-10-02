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
    Product.findByPk(id)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', { title: 'Edit product', path: '/admin/edit-product', editing: editMode, product: product });
        })
        .catch(error => console.log(error));
};

exports.postEditProduct = (req, res, next) => {
    Product.findByPk(req.body.id)
        .then(product => {
            product.title = req.body.title;
            product.price = req.body.price;
            product.description = req.body.description;
            product.imageUrl = req.body.imageUrl;
            return product.save(); // return a promise that chained with next then
        })
        .then(res.redirect('/admin/products')) // this then is a result from return product.save() 
        .catch(error => console.log(error));
};

exports.postAddProduct = (req, res, next) => {
    req.user.createProduct({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
    })
        .then(res.redirect('/admin/products'))
        .catch(error => console.log(error));

};

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => res.render('admin/product-list', { products: products, title: 'All products', path: '/admin/products' }))
        .catch(error => console.log(error));
};

exports.deleteProduct = (req, res, next) => {
    const id = req.body.id;
    Product.findByPk(id)
        .then(product => {
            return product.destroy();
        })
        .then(res.redirect('/admin/products'));
};