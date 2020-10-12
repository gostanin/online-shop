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
    password: {
        type: String,
        required: true,
    },
    resetToken: String,
    resetTokenExp: Date,
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

userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex((item) => {
        return item.productId.toString() === product._id.toString();
    });
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        updatedCartItems[cartProductIndex].quantity += 1;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: 1,
        });
    }

    const updatedCart = {
        items: updatedCartItems,
    };
    this.cart = updatedCart;
    return this.save();
};

userSchema.methods.deleteCartItem = function (id) {
    const updatedCartItems = this.cart.items.filter(
        (item) => item.productId.toString() !== id
    );

    this.cart.items = updatedCartItems;
    return this.save();
};

userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
};

module.exports = mongoose.model("User", userSchema);
