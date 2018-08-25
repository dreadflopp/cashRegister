/* eslint-disable no-underscore-dangle,no-trailing-spaces */
class Receipt {

    /**
     *
     * @param {Item[]} items
     * @param {String} time
     */
    constructor(items, time) {
        this._time = time;
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
    /*
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
    */

    /**
     *
     * @param {string} receiptId
     * @returns {number}
     */
    /*
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
    */

    /**
     *
     * @returns {number}
     */
    getSum() {
        let sum = 0;
        this._items.forEach((item) => {
            sum += item.discountedPrice();
        });

        return sum;
    }

    /**
     *
     * @param {Item} item
     */
    addItem(item) {
        this._items.push(item);
    }

    /**
     *
     * @param {number} index
     * @returns {boolean}
     */
    removeItem(index) {
        if (index < this._items.length && index > -1) {
            this._items.splice(index, 1);
            return true;
        }

        return false;
    }

    length() {
        return this._items.length;
    }

    clear() {
        this._items.length = 0;
        this._time = '';
    }

    toConsole() {
        this._items.forEach((item) => {
// eslint-disable-next-line no-console
            console.log(`Seller: ${item.seller} price: ${item.price} discount: ${item.discount} \n`);
        });
    }

    autoTime() {
        this._time = new Date().toLocaleString('sv-SE');
    }
}

module.exports = Receipt;
