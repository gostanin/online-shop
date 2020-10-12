const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render("shop/product-list", {
                products: products,
                title: "All products",
                path: "/products",
            });
        })
        .catch((error) => console.log(error));
};

exports.getProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .then((product) => {
            res.render("shop/product-detail", {
                path: "/products",
                title: "Details",
                product: product,
            });
        })
        .catch((error) => console.log(error));
};

exports.getIndex = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render("shop/index", {
                products: products,
                title: "Shop",
                path: "/",
            });
        })
        .catch((error) => console.log(error));
};

exports.getCart = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .execPopulate()
        .then((user) => {
            res.render("shop/cart", {
                path: "/cart",
                title: "Your Cart",
                products: user.cart.items,
            });
        })
        .catch((error) => console.log(error));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.id;
    Product.findById(prodId)
        .then((product) => {
            return req.user.addToCart(product);
        })
        .then((result) => {
            res.redirect("/");
        });
};

exports.deleteCartItem = (req, res, next) => {
    req.user
        .deleteCartItem(req.body.id)
        .then((result) => {
            res.redirect("/cart");
        })
        .catch((error) => console.log(error));
};

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        path: "/checkout",
        title: "Checkout",
    });
};

exports.getOrders = (req, res, next) => {
    Order.find({ "user.userId": req.user._id }).then((orders) => {
        res.render("shop/orders", {
            path: "/orders",
            title: "Orders",
            orders: orders,
        });
    });
};

exports.postOrder = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .execPopulate()
        .then((user) => {
            const products = user.cart.items.map((item) => {
                return {
                    quantity: item.quantity,
                    product: { ...item.productId._doc },
                };
            });
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user,
                },
                items: products,
            });
            return order.save();
        })
        .then((result) => {
            return req.user.clearCart();
        })
        .then((result) => {
            res.redirect("/orders");
        })
        .catch((error) => console.log(error));
};
