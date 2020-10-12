const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const User = require("../models/user");

const transport = nodemailer.createTransport({
    host: "***REMOVED***",
    ***REMOVED***,
    auth: {
        user: "***REMOVED***",
        pass: "***REMOVED***",
    },
});

exports.getLogin = (req, res, next) => {
    res.render("auth/login", {
        path: "/login",
        title: "Login",
        errorMsg: req.flash("error"),
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    if (email && password) {
        User.findOne({ email: email })
            .then((user) => {
                if (user && bcrypt.compareSync(password, user.password)) {
                    req.session.user = user;
                    req.session.isLoggedIn = true;
                    return req.session.save();
                }
                req.flash("error", "Invalid email or password");
                throw "Invalid";
            })
            .then((result) => {
                res.redirect("/");
            })
            .catch((error) => {
                console.log(error);
                res.redirect("/login");
            });
    } else {
        req.flash("error", "Email and password required");
        res.redirect("/login");
    }
};

exports.getLogout = (req, res, next) => {
    req.session.destroy((error) => {
        console.log(error);
        res.redirect("/");
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({ email: email })
        .then((userCheck) => {
            if (userCheck) {
                req.flash("error", "Email is already registered");
                return res.redirect("/signup");
            } else {
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
                    });
            }
        })
        .catch((error) => console.log(error));
};

exports.getSignup = (req, res, next) => {
    res.render("auth/signup", {
        path: "/signup",
        title: "Signup",
        errorMsg: req.flash("error"),
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
                .catch((error) => console.log(error));
        } else {
            console.log(error);
            return res.redirect("/reset");
        }
    });
};

exports.getNewPasswords = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExp: { $gt: Date.now() } })
        .then((user) => {
            if (user) {
                res.render("auth/new-password", {
                    path: "/new-password",
                    title: "Update password",
                    id: user._id.toString(),
                    token: token,
                    errorMsg: req.flash("error"),
                });
            } else {
                res.redirect("/");
            }
        })
        .catch((error) => console.log(error));
};

exports.postNewPassword = (req, res, next) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const userId = req.body.id;
    const token = req.body.token;
    console.log(userId, token);
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
                console.log(result);
                res.redirect("/login");
            })
            .catch((error) => console.log(error));
    } else {
        req.flash("error", "Passwords do not match");
        res.redirect(`/reset/${token}`);
    }
};
