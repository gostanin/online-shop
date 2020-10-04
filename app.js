const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express(); // valid request listener

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop')
const errorController = require('./controllers/error');
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');;
const Order = require('./models/order');;
const OrderItem = require('./models/orderItems');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(error => console.log(error));
});
//request, response, next(function on a list)
//order of a middle ware is important

app.use('/admin', adminRoutes);
app.use(userRoutes);

app.use(errorController.get404)

// const server = http.createServer(app); //ctrl+shift+space

// server.listen(8080);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem })

// {force:true}
sequelize.sync()
    .then(() => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Admin', email: 'test@test.com' });
        }
        return user; //Promise.resolve(user) not need to use becaues then block automatically wraps return statmenet into Promise;
    })
    .then(user => {
        return user.createCart();
    })
    .then(() => {
        app.listen(3000);
    })
    .catch(error => console.log(error));