const db = require('../utils/database');

const Cart = require('./cart');

module.exports = class Product {
    constructor(id, title, price, description, imageUrl) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    save() {
        return db.execute('insert into products(title, price, description, imageUrl) values(?, ?, ?, ?)', 
                            [this.title, this.price, this.description, this.imageUrl]);
    }

    static fetchAll() {
        return db.execute('select * from products');
    }

    static delete(id) {
        return db.execute(`delete from products where id = ?`, [id])
    }

    static findById(id) {
        return db.execute(`select * from products where id = ?`, [id])
    }
};
