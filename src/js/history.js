const Receipt = require('./receipt');

const history = (function () {
    const receipts = [];
    let index = -1;

    /**
     *
     * @param {Item[]} items
     * @returns {*}
     */
    const addReceipt = function (items) {
        if (items.length > 0) {
            const receipt = new Receipt(items);
            const time = receipt.time;
            receipts.push(receipt);
            return time;
        }
        return false;
    };

    const toConsole = function () {
        let str = '';
        receipts.forEach((receipt) => {
            str += `Time: ${receipt.time}\n`;
            receipt.items.forEach((item) => {
                str += `Seller: ${item.seller} Price: ${item.price} Discount: ${item.discount}\n Discounted price: ${item.discountedPrice()}`;
            });
        });
// eslint-disable-next-line no-console
        console.log(str);
    };

    const getReceipt = function (i) {
        return receipts[i];
    };

    const getReceiptTimes = function () {
        const times = [];
        receipts.forEach((receipt) => {
            times.push(receipt.time);
        });
        return times;
    };

    const getIndex = function () { return index; };
    const setIndex = function (newIndex) { index = newIndex; };
    const resetIndex = function () { index = -1; };

    return {
        addReceipt,
        toConsole,
        getReceipt,
        getReceiptTimes,
        getIndex,
        setIndex,
        resetIndex,
    };
}());

module.exports = history;
