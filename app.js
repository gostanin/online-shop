const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');

const app = express(); // valid request listener

app.engine('hbs', expressHbs({layoutDir: 'views/layouts/', defaultLayout: 'main-layout'}))

app.set('view engine', 'hbs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const userRouters = require('./routes/shop')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
//request, response, next(function on a list)
//order of a middle ware is important

app.use('/admin', adminData.routes);
app.use(userRouters);



app.use((req, res, next) => {
    res.status(404).render('404', {title: 'Page Not Found'});
})

// const server = http.createServer(app); //ctrl+shift+space

// server.listen(8080);

app.listen(8080);