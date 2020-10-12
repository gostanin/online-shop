const express = require("express");

const productsController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// use not getting exact matching, but get/post matches exactly
router.get("/", productsController.getIndex);

router.get("/products", productsController.getProducts);

router.get("/products/:id", productsController.getProduct); // order sensetive product/delete after this route wouldn't be executed

router.get("/cart", isAuth, productsController.getCart);

router.post("/cart", isAuth, productsController.postCart);

router.post("/cart-delete-item", isAuth, productsController.deleteCartItem);

router.get("/checkout", isAuth, productsController.getCheckout);

router.get("/orders", isAuth, productsController.getOrders);

router.post("/create-order", isAuth, productsController.postOrder);

module.exports = router;
