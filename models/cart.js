const fs = require('fs');
const path = require('path');


const filepath = path.join(rootdir, 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id) {
        fs.readFile(filepath, (error, content) => {
            let cart = {products: [], totalPrice: 0};
            if (!error) {
                cart = JSON.parser(content);
            }

            const existingProductIndex = cart.products.findIndex((product) => product.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct) {
                updatedProduct = { ...existingProduct }
                updatedProduct.qty += 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = existingProduct;
            } else {
                updatedProduct = { id: id, qty: 1};
                cart.products = [...cart.products, updatedProduct]
            }
            cart.totalPrice += productPrice;

            fs.writeFile(filepath, cart, (error) => {
                console.log(error);
            });
        })
    }
}