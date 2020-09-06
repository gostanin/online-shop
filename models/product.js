const fs = require('fs');
const path = require('path');
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
    constructor(title, price, description) {
        this.title = title;
        this.price = price;
        this.description = description;
    }

    save() {
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
};
