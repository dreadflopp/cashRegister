/* eslint-disable no-underscore-dangle,no-trailing-spaces */
const log = require('./log');
const Receipt = require('./receipt');
const Item = require('./item');

class ReceiptStorage {
    constructor() {
        /**
         *
         * @type {Receipt[]}
         * @private
         */
        this._receipts = [];
        log('Receipt storage constructor');
    }

    /**
     *
     * @returns {Receipt[]}
     */
    get receipts() {
        log(`Receipt storage get receipts array with length: ${this._receipts.length}`);
        return this._receipts;
    }

    /**
     *
     * @param {Receipt[]} value
     */
    set receipts(value) {
        log('Receipt storage setter');
        this._receipts = value;
    }

    getReceipt(index) {
        log(`Receipt Storage get receipt with index: ${index}. Receipt length is: ${this._receipts[index].length()}`);
        return this._receipts[index];
    }

    /**
     *
     * @param {Receipt} receipt
     */
    addReceipt(receipt) {
        log('Receipt storage add');
        log(`Receipt storage receipts array length before: ${this._receipts.length}`);
        this._receipts.push(receipt);
        log(`Receipt storage receipts array length after: ${this._receipts.length}`);
        log(`Number of items in added receipt: ${receipt.length()}`);
        const index = this.receipts.length - 1;
        log(`Index of last added receipt: ${index}`);
        log(`Checking number of items in last added receipt: ${this._receipts[index].length()}`);
    }

    /**
     *
     * @param {number} index
     * @returns {Receipt|boolean}
     */
    returnReceipt(index) {
        log(`Receipt storage return. Index of receipt to return: ${index}`);
        if (index < this._receipts.length && index > -1) {
            const receipt = this._receipts[index];
            const items = [];
            const time = receipt.time;
            receipt.items.forEach((item) => {
                const seller = item.seller;
                const price = item.price;
                const discount = item.discount;
                items.push(new Item(seller, price, discount));
            });

            this._receipts.splice(index, 1);
            return new Receipt(items, time);
        }

        return false;
    }

    toConsole() {
        console.log('---------------------');
        this._receipts.forEach((receipt) => {
            receipt.toConsole();
        });
        console.log('---------------------');
    }
}

module.exports = ReceiptStorage;
