const bcrypt = require("bcryptjs");

const User = require("../models/user");

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
                    .then((result) => res.redirect("/login"));
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
