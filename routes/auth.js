const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post(
    "/login",
    [
        check("email").isEmail().withMessage("Please enter valid email").normalizeEmail(),
        check("password").notEmpty().withMessage("Please enter password").trim(),
    ],
    authController.postLogin
);

router.get("/logout", authController.getLogout);

router.get("/signup", authController.getSignup);

router.post(
    "/signup",
    [
        check("email")
            .isEmail()
            .withMessage("Please enter a valid email")
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then((userCheck) => {
                    if (userCheck) {
                        return Promise.reject("Email is already registered");
                    }
                });
            })
            .normalizeEmail(),
        body("password", "Password must be at least 5 characters")
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body("confrimPassword")
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Passwords have to match");
                }
                return true;
            })
            .trim(),
    ],
    authController.postSignup
);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPasswords);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
