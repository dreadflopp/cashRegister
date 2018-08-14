/* eslint-disable no-underscore-dangle */
class Item {
    constructor(seller, price, discount) {
        this._seller = seller;
        this._price = price;
        this._discount = discount;
    }

    get seller() {
        return this._seller;
    }

    set seller(value) {
        this._seller = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }

    get discount() {
        return this._discount;
    }

    set discount(value) {
        this._discount = value;
    }

    discountedPrice() {
        return this._price - ((this._price * this._discount) / 100);
    }
}

module.exports = Item;
