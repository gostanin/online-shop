const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express(); // valid request listener

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');
// const errorController = require('./controllers/error');
const mongoConnect = require('./utils/database').mongoConnect;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     User.findByPk(1)
//         .then(user => {
//             req.user = user;
//             next();
//         })
//         .catch(error => console.log(error));
// });
//request, response, next(function on a list)
//order of a middle ware is important

app.use('/admin', adminRoutes);
app.use(userRoutes);

// app.use(errorController.get404)

// const server = http.createServer(app); //ctrl+shift+space

// server.listen(8080);

mongoConnect(() => {
    app.listen(3000);
})

