const { validationResult } = require("express-validator");

const Product = require("../models/product");

const editProductData = {
    title: "Edit product",
    path: "/admin/edit-product",
    editing: true,
};

const addProductData = {
    title: "Add product",
    path: "/admin/add-product",
    editing: false,
};

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", { ...addProductData, errors: [] });
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
                throw new Error("Product is not found");
            }
            res.render("admin/edit-product", {
                ...editProductData,
                product: product,
            });
        })
        .catch((error) => next(error));
};

exports.postEditProduct = (req, res, next) => {
    errors = validationResult(req);

    Product.findById(req.body.id)
        .then((product) => {
            if (!product) {
                throw new Error("Product is not found");
            }
            if (!errors.isEmpty()) {
                return res.status(422).render("admin/edit-product", {
                    ...editProductData,
                    product: product,
                    errors: errors.array(),
                });
            }
            if (product.userId.toString() === req.user._id.toString()) {
                product.title = req.body.title;
                product.price = req.body.price;
                product.description = req.body.description;
                product.imageUrl = req.body.imageUrl;
                return product
                    .save()
                    .then((result) => res.redirect("/admin/products"));
            }
        })
        .catch((error) => next(error));
};

exports.postAddProduct = (req, res, next) => {
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("admin/edit-product", {
            ...addProductData,
            errors: errors.array(),
        });
    }
    title = req.body.title;
    price = req.body.price;
    description = req.body.description;
    imageUrl = req.body.imageUrl;
    product = new Product({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        userId: req.user,
    });
    product
        .save()
        .then((result) => res.redirect("/admin/products"))
        .catch((error) => next(error));
};

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        // .select('title price -_id') get title, price field but not _id
        // .populate('userId', 'name') get users for given userid and get only name field
        .then((products) => {
            if (!products) {
                throw new Error("Products are not found");
            }
            res.render("admin/product-list", {
                products: products,
                title: "All products",
                path: "/admin/products",
            });
        })
        .catch((error) => next(error));
};

exports.deleteProduct = (req, res, next) => {
    const id = req.body.id;
    Product.findOneAndDelete({ _id: id, userId: req.user._id })
        .then((result) => res.redirect("/admin/products"))
        .catch((error) => next(error));
};
