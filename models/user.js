const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: { type: Number, required: true },
            },
        ],
    },
});

module.exports = mongoose.model("User", userSchema);
// const mongodb = require("mongodb");
// const getDb = require("../utils/database").getDb;

// class User {
//     constructor(username, email, cart, id) {
//         this.name = username;
//         this.email = email;
//         this.cart = cart;
//         this._id = new mongodb.ObjectId(id);
//     }

//     save() {
//         const db = getDb();
//         return db.collection("users").insertOne(this);
//     }

//     addToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex((item) => {
//             return item.productId.toString() === product._id.toString();
//         });
//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];

//         if (cartProductIndex >= 0) {
//             updatedCartItems[cartProductIndex].quantity += 1;
//         } else {
//             updatedCartItems.push({
//                 productId: new mongodb.ObjectId(product._id),
//                 quantity: 1,
//             });
//         }

//         const updatedCart = {
//             items: updatedCartItems,
//         };
//         const db = getDb();
//         return db
//             .collection("users")
//             .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
//     }

//     getCart() {
//         const productIds = this.cart.items.map((item) => {
//             return item.productId;
//         });
//         const db = getDb();
//         return db
//             .collection("products")
//             .find({ _id: { $in: productIds } })
//             .toArray()
//             .then((products) => {
//                 return products.map((product) => {
//                     return {
//                         ...product,
//                         quantity: this.cart.items.find((item) => {
//                             return (
//                                 item.productId.toString() ===
//                                 product._id.toString()
//                             );
//                         }).quantity,
//                     };
//                 });
//             });
//     }

//     deleteCartItem(id) {
//         const updatedCartItems = this.cart.items.filter(
//             (item) => item.productId.toString() !== id
//         );
//         const db = getDb();
//         return db
//             .collection("users")
//             .updateOne(
//                 { _id: this._id },
//                 { $set: { cart: { items: updatedCartItems } } }
//             );
//     }

//     addOrder() {
//         const db = getDb();
//         return this.getCart()
//             .then((products) => {
//                 const order = {
//                     items: products,
//                     user: {
//                         _id: this._id,
//                         name: this.name,
//                         email: this.email,
//                     },
//                 };
//                 return db.collection("orders").insertOne(order);
//             })
//             .then((result) => {
//                 this.cart = { items: [] };
//                 return db
//                     .collection("users")
//                     .updateOne(
//                         { _id: this._id },
//                         { $set: { cart: this.cart } }
//                     );
//             });
//     }

//     getOrders() {
//         const db = getDb();
//         return db.collection("orders").find({ "user._id": this._id }).toArray();
//     }

//     static findById(id) {
//         const db = getDb();
//         return db.collection("users").findOne({ _id: mongodb.ObjectId(id) });
//     }
// }

// module.exports = User;
