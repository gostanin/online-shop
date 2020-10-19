const path = require("path");
const express = require("express");
const { check } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

const checkMiddleware = {
    title: check(
        "title",
        "Title must be not empty and contain only letters and numbers"
    )
        .notEmpty()
        .bail()
        .isString()
        .trim(),
    imageUrl: check("imageUrl", "Image URL is not valid").isURL(),
    price: check(
        "price",
        "Price must be numbers must be between [0, 50,000]"
    ).isFloat({
        min: 0,
        max: 50000,
    }),
    description: check("description")
        .notEmpty()
        .withMessage("Description cannot be empty")
        .trim(),
};

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post(
    "/add-product",
    [
        checkMiddleware.title,
        checkMiddleware.imageUrl,
        checkMiddleware.price,
        checkMiddleware.description,
    ],
    isAuth,
    adminController.postAddProduct
);

router.get("/products", isAuth, adminController.getProducts);

router.get("/edit-product/:id", isAuth, adminController.getEditProduct);

router.post(
    "/edit-product",
    [
        checkMiddleware.title,
        checkMiddleware.imageUrl,
        checkMiddleware.price,
        checkMiddleware.description,
    ],
    isAuth,
    adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.deleteProduct);

module.exports = router;
