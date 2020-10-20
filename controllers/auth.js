const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/user");

const transport = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    auth: {
        user: process.env.SMPT_USER,
        pass: process.env.SMPT_PASS,
    },
});

const loginData = {
    path: "/login",
    title: "Login",
};

exports.getLogin = (req, res, next) => {
    const errors = req.flash("error")[0];
    res.render("auth/login", { ...loginData, errorMsg: errors });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("auth/login", {
            ...loginData,
            errorMsg: errors.array()[0].msg,
        });
    }
    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                throw new Error("User is not found");
            }
            if (bcrypt.compareSync(password, user.password)) {
                req.session.user = user;
                req.session.isLoggedIn = true;
                return req.session.save().then((result) => res.redirect("/"));
            }
            req.flash("error", "Invalid email or password");
            return res.redirect("/login");
        })
        .catch((error) => next(error));
};

exports.getLogout = (req, res, next) => {
    req.session.destroy((error) => next(error));
};

exports.postSignup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("auth/signup", {
            path: "/signup",
            title: "Signup",
            errorMsg: errors.array()[0],
            signupData: { email: email, password: password },
            invalidField: errors.array(),
        });
    }
    const email = req.body.email;
    const password = req.body.password;
    bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
            const user = new User({
                name: "default",
                email: email,
                password: hashedPassword,
            });
            return user.save();
        })
        .then((result) => {
            transport.sendMail({
                to: email,
                from: "shop@shop.com",
                subject: "Signup succeeded!",
                html: "<h1> Sucessfully sighed up </h1>",
            });
            res.redirect("/login");
        })
        .catch((error) => next(error));
};

exports.getSignup = (req, res, next) => {
    const errors = validationResult(req);
    res.render("auth/signup", {
        path: "/signup",
        title: "Signup",
        errorMsg: errors.array()[0],
        signupData: { email: "", password: "" },
        invalidField: [],
    });
};

exports.getReset = (req, res, next) => {
    res.render("auth/reset", {
        path: "/reset",
        title: "Reset password",
        errorMsg: req.flash("error"),
        successMsg: req.flash("success"),
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (error, buffer) => {
        if (!error) {
            const token = buffer.toString("hex");
            User.findOne({ email: req.body.email })
                .then((user) => {
                    if (user) {
                        user.resetToken = token;
                        user.resetTokenExp = Date.now() + 3600000;
                        return user.save();
                    }
                })
                .then((result) => {
                    transport.sendMail({
                        to: req.body.email,
                        from: "shop@shop.com",
                        subject: "Password reset",
                        html: `
                            <p>Click to send a new password</p>
                            <a href="http://localhost:3000/reset/${token}">Click link</a>
                        `,
                    });
                    req.flash("success", "Email has been sent");
                    res.redirect("/reset");
                })
                .catch((error) => next(error));
        } else {
            throw new Error("crypto function number generation failed");
        }
    });
};

exports.getNewPasswords = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExp: { $gt: Date.now() } })
        .then((user) => {
            if (!user) {
                res.redirect("/");
            }
            res.render("auth/new-password", {
                path: "/new-password",
                title: "Update password",
                id: user._id.toString(),
                token: token,
                errorMsg: req.flash("error"),
            });
        })
        .catch((error) => next(error));
};

exports.postNewPassword = (req, res, next) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const userId = req.body.id;
    const token = req.body.token;
    if (password === confirmPassword) {
        return User.updateOne(
            {
                _id: userId,
                resetToken: token,
                resetTokenExp: { $gt: Date.now() },
            },
            {
                $set: {
                    password: bcrypt.hashSync(password, 12),
                },
                $unset: {
                    resetToken: 1,
                    resetTokenExp: 1,
                },
            }
        )
            .then((result) => {
                res.redirect("/login");
            })
            .catch((error) => next(error));
    } else {
        req.flash("error", "Passwords do not match");
        res.redirect(`/reset/${token}`);
    }
};
