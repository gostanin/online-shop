const { validationResult } = require("express-validator");

const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        title: "Add product",
        path: "/admin/add-product",
        editing: false,
        errors: [],
    });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect("/");
    }
    const id = req.params.id;
    Product.findById(id)
        .then((product) => {
            if (!product) {
                return res.redirect("/");
            }
            res.render("admin/edit-product", {
                title: "Edit product",
                path: "/admin/edit-product",
                editing: editMode,
                product: product,
                errors: [],
            });
        })
        .catch((error) => console.log(error));
};

exports.postEditProduct = (req, res, next) => {
    errors = validationResult(req);

    Product.findById(req.body.id)
        .then((product) => {
            if (!errors.isEmpty()) {
                return res.status(422).render("admin/edit-product", {
                    title: "Edit product",
                    path: "/admin/edit-product",
                    editing: true,
                    product: product,
                    errors: errors.array(),
                });
            }
            if (product.userId.toString() === req.user._id.toString()) {
                product.title = req.body.title;
                product.price = req.body.price;
                product.description = req.body.description;
                product.imageUrl = req.body.imageUrl;
                return product.save();
            }
        })
        .then((result) => {
            res.redirect("/admin/products");
        })
        .catch((error) => console.log(error));
};

exports.postAddProduct = (req, res, next) => {
    title = req.body.title;
    price = req.body.price;
    description = req.body.description;
    imageUrl = req.body.imageUrl;
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("admin/edit-product", {
            title: "Add product",
            path: "/admin/add-product",
            editing: false,
            errors: errors.array(),
        });
    }
    product = new Product({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        userId: req.user,
    });
    product
        .save()
        .then(res.redirect("/admin/products"))
        .catch((error) => console.log(error));
};

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        // .select('title price -_id') get title, price field but not _id
        // .populate('userId', 'name') get users for given userid and get only name field
        .then((products) => {
            res.render("admin/product-list", {
                products: products,
                title: "All products",
                path: "/admin/products",
            });
        })
        .catch((error) => console.log(error));
};

exports.deleteProduct = (req, res, next) => {
    const id = req.body.id;
    Product.findOneAndDelete({ _id: id, userId: req.user._id }).then(() =>
        res.redirect("/admin/products")
    );
};
