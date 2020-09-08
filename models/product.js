const fs = require('fs');
const path = require('path');
const { v1: uuidv1 } = require('uuid');

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
    constructor(title, price, description, imageUrl) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    save() {
        this.id = uuidv1();
        getProductsFromFile((products) => {
            products.push(this);
            fs.writeFile(filepath, JSON.stringify(products), (error) => {
                console.log(error);
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile((products) => {
            const product = products.find((p) => p.id === id);
            cb(product);
        });
    }
};
