const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        title: "Add product",
        path: "/admin/add-product",
        editing: false,
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
            });
        })
        .catch((error) => console.log(error));
};

exports.postEditProduct = (req, res, next) => {
    product = new Product(
        req.body.title,
        req.body.price,
        req.body.description,
        req.body.imageUrl,
        req.body.id
    );
    product
        .save()
        .then(() => res.redirect("/admin/products")) // this then is a result from return product.save()
        .catch((error) => console.log(error));
};

exports.postAddProduct = (req, res, next) => {
    title = req.body.title;
    price = req.body.price;
    description = req.body.description;
    imageUrl = req.body.imageUrl;
    product = new Product(
        title,
        price,
        description,
        imageUrl,
        null,
        req.user._id
    );
    product
        .save()
        .then(res.redirect("/admin/products"))
        .catch((error) => console.log(error));
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then((products) =>
            res.render("admin/product-list", {
                products: products,
                title: "All products",
                path: "/admin/products",
            })
        )
        .catch((error) => console.log(error));
};

exports.deleteProduct = (req, res, next) => {
    const id = req.body.id;
    console.log(id);
    Product.deleteById(id).then(() => res.redirect("/admin/products"));
};
