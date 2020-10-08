const mongodb = require("mongodb");
const getDb = require("../utils/database.js").getDb;

class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId
    }

    save() {
        const db = getDb();
        let result;
        if (this._id) {
            result = db
                .collection("products")
                .updateOne({ _id: this._id }, { $set: this });
        } else {
            result = db.collection("products").insertOne(this);
        }
        return result
            .then((result) => {
                console.log(result);
            })
            .catch((error) => console.log(error));
    }

    static fetchAll() {
        const db = getDb();
        return db
            .collection("products")
            .find()
            .toArray()
            .then((products) => {
                return products;
            })
            .catch((error) => console.log(error));
    }

    static findById(id) {
        const db = getDb();
        return db
            .collection("products")
            .find({ _id: new mongodb.ObjectId(id) })
            .next()
            .then((product) => {
                return product;
            })
            .catch((error) => console.log(error));
    }

    static deleteById(id) {
        const db = getDb();
        return db
            .collection("products")
            .deleteOne({ _id: new mongodb.ObjectId(id) })
            .then((result) => {
                console.log('deleted');
            })
            .catch((error) => console.log(error));
    }
}

module.exports = Product;
