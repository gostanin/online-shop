const fs = require('fs');
const path = require('path');
const { v1: uuidv1 } = require('uuid');

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
