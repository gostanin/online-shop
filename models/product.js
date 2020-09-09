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
    constructor(id, title, price, description, imageUrl) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    save() {
        getProductsFromFile((products) => {
            const updatedProducts = [...products];
            if (this.id) {
                const existingProductIndex = products.findIndex(product => product.id === this.id);
                updatedProducts[existingProductIndex] = this;
            } else {
                this.id = uuidv1();
                console.log(updatedProducts);
                updatedProducts.push(this);
            }
            fs.writeFile(filepath, JSON.stringify(updatedProducts), (error) => {
                console.log(error);
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static delete(id) {
        getProductsFromFile(products => {
            const updatedProducts = products.filter(product => product.id !== id);
            fs.writeFile(filepath, JSON.stringify(updatedProducts), (error) => {
                console.log(error);
            });
        })
    }

    static findById(id, cb) {
        getProductsFromFile((products) => {
            const product = products.find((p) => p.id === id);
            cb(product);
        });
    }
};
