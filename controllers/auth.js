const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    res.render("auth/login", {
        path: "/login",
        title: "Login",
        isAuthenticated: req.session.isLoggedIn,
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    if (email && password) {
        User.findOne({ email: email })
            .then((user) => {
                if (user.password === password) {
                    req.session.user = user;
                    req.session.isLoggedIn = true;
                    return req.session.save();
                }
            })
            .then((result) => {
                res.redirect("/");
            })
            .catch((error) => console.log(error));
    } else {
        res.redirect("/login");
    }
};

exports.getLogout = (req, res, next) => {
    req.session.destroy((error) => {
        console.log(error);
        res.redirect("/");
    });
};
