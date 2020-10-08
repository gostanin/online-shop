const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express(); // valid request listener

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findById("5f7f8a00ad94cf18f0297991")
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((error) => console.log(error));
});
//request, response, next(function on a list)
//order of a middle ware is important

app.use("/admin", adminRoutes);
app.use(userRoutes);

app.use(errorController.get404);

// const server = http.createServer(app); //ctrl+shift+space

// server.listen(8080);

mongoose
    .connect(
        `mongodb+srv://***REMOVED***:${process.env.DB_PSW}@cluster0.dpwzp.mongodb.net/***REMOVED***`
    )
    .then((result) => {
        User.findOne().then((user) => {
            if (!user) {
                const user = new User({
                    name: "Admin",
                    email: "test@test.com",
                });
            user.save();
            }
        });
        app.listen(3000);
    })
    .catch((error) => console.log(error));
