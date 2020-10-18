const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const csrf = require("csurf");
const flash = require("connect-flash");

const session = require("express-session");
const MondoDBStore = require("connect-mongodb-session")(session);

const dotenv = require("dotenv");
dotenv.config();

const app = express(); // valid request listener
const store = new MondoDBStore({
    uri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PSW}@cluster0.dpwzp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");
const User = require("./models/user");

const csrfProtection = csrf();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
    session({
        secret: "my secret a long string value",
        resave: false,
        saveUninitialized: false,
        store: store,
        // unset: "destroy",
    })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((error) => console.log(error));
});
//request, response, next(function on a list)
//order of a middle ware is important

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use("/admin", adminRoutes);
app.use(userRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// const server = http.createServer(app); //ctrl+shift+space

// server.listen(8080);

mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dpwzp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
        { useUnifiedTopology: true, useNewUrlParser: true }
    )
    .then((result) => {
        app.listen(3000);
    })
    .catch((error) => console.log(error));
