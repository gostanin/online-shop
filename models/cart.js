const fs = require('fs');
const path = require('path');

const rootdir = require('../utils/path');


const filepath = path.join(rootdir, 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(filepath, (error, content) => {
            let cart = {products: [], totalPrice: 0};
            if (!error) {
                cart = JSON.parse(content);
            }
            
            const existingProductIndex = cart.products.findIndex((product) => product.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct) {
                updatedProduct = { ...existingProduct }
                updatedProduct.qty += 1;
                console.log(updatedProduct);
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1};
                cart.products = [...cart.products, updatedProduct]
            }
            cart.totalPrice += +productPrice;
            
            fs.writeFile(filepath, JSON.stringify(cart), (error) => {
                console.log(error);
            });
        })
    }

    static getProducts(cb) {
        fs.readFile(filepath, (error, content) => {
            let cart = {products: [], totalPrice: 0};
            if (!error) {
                cart = JSON.parse(content);
            }

            cb(cart);
        })
    }
}