const fs = require('fs');
const path = require('path');

const db = require('../utils/database');

const Cart = require('./cart');
const rootdir = require('../utils/path');


const filepath = path.join(rootdir, 'data', 'products.json');

const getProductsFromFile = (cb) => {
    fs.readFile(filepath, (error, content) => {
        if (error) {
            cb([]);
        }
        else {
            cb(JSON.parse(content));
        }
    })
}

module.exports = class Product {
    constructor(id, title, price, description, imageUrl) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    save() {
        return db.execute(`insert into products(title, price, description, imageUrl)
                           values('${this.title}', ${this.price}, '${this.description}', '${this.imageUrl}')`);
    }

    static fetchAll() {
        return db.execute('select * from products');
    }

    static delete(id) {
        getProductsFromFile(products => {
            const product = products.find(product => product.id === id);
            Cart.deleteProduct(id, product.price);
            const updatedProducts = products.filter(product => product.id !== id);
            fs.writeFile(filepath, JSON.stringify(updatedProducts), (error) => {
                console.log(error);
            });
        })
    }

    static findById(id) {
        return db.execute(`select * from products where id = ${id}`)
    }
};
