/* eslint-disable no-underscore-dangle */
const Item = require('./item');

class Receipt {
    /**
     *
     * @param {Item[]} items
     */
    constructor(items) {
        this._time = new Date().toLocaleString('sv-SE');
        this._items = items;
    }

    /**
     *
     * @returns {Item[]}
     */
    get items() {
        return this._items;
    }

    /**
     *
     * @param {Item[]} value
     */
    set items(value) {
        this._items = value;
    }

    /**
     *
     * @returns {string}
     */
    get time() {
        return this._time;
    }

    /**
     *
     * @param {string} value
     */
    set time(value) {
        this._time = value;
    }

    /**
     *
     * @param {string} receiptId
     * @returns {Receipt}
     */
    static fromNode(receiptId) {
        // get receipt-node
        const receiptNode = document.getElementById(receiptId);

        // get all items
        const itemsNode = receiptNode.getElementsByClassName('item');
        const items = [];
        Array.from(itemsNode).forEach((item) => {
            const seller = Number(item.getElementsByClassName('seller'[0]).innerText);
            const price = Number(item.getElementsByClassName('price')[0].innerText);
            const discount = Number(item.getElementsByClassName('discount')[0].innerText);
            items.push(new Item(seller, price, discount));
        });
        return new Receipt(items);
    }

    /**
     *
     * @param {string} receiptId
     * @returns {number}
     */
    static sum(receiptId) {
        // get receipt
        const receipt = this.fromNode(receiptId);

        // get all items
        const items = receipt.items;

        // calculate sum
        let sum = 0;

        items.forEach((item) => {
            sum += item.discountedPrice();
        });
        return sum;
    }
}

module.exports = Receipt;
