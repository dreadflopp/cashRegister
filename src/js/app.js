/* eslint-disable no-trailing-spaces */
const UserInterface = require('./userInterface');
const Item = require('./item');

class App {
    static validateForm() {
        // variables
        let validPrice = false;
        let validSeller = false;
        let validDiscount = false;

        // DOM elements
        const sellerElement = document.getElementById('seller');
        const priceElement = document.getElementById('price');
        const discountElement = document.getElementById('discount');
        const isDiscountedElement = document.getElementById('is-discounted');

        // Remove invalid classes
        sellerElement.classList.remove('invalid');
        priceElement.classList.remove('invalid');
        discountElement.classList.remove('invalid');

        // Validate seller
        let seller = sellerElement.value;
        if (seller) {
            seller = seller.trim();
            if (/^[1-9][0-9]*$/.test(seller)) {
                validSeller = true;
            }
        }

        // Validate price
        let price = priceElement.value;
        if (price) {
            price = price.trim();
            if (/^[0-9]+([.|,][0-9]{1,2})?$/.test(price)) {
                validPrice = true;
            }
        }

        // Validate discounted
        if (isDiscountedElement.checked) {
            let discount = discountElement.value;
            if (discount) {
                discount = discount.trim();
                if (/^[1-9][0-9]*$/.test(discount)) {
                    validDiscount = true;
                }
            }
        } else {
            validDiscount = true;
        }


        // Add invalid class to invalid fields
        if (!validSeller) {
            sellerElement.classList.add('invalid');
        }

        if (!validPrice) {
            priceElement.classList.add('invalid');
        }

        if (!validDiscount) {
            discountElement.classList.add('invalid');
        }

        // Return result
        return validSeller && validPrice && validDiscount;
    }

    static showSelectedReceipt() {
        // Clear receipt
        UserInterface.clearReceipt('history-receipt');

        // Unhide the selected receipt area
        UserInterface.showReceipt('history-receipt');

        // Get index of selected container
        // const selected = this.parentNode;
        const selected = UserInterface.getSelectedReceipt();

        // Calculate index
        const parent = selected.parentNode;
        const indexFromEnd = Array.prototype.indexOf.call(parent.children, selected);
        const indexFromStart = document.getElementsByClassName('radio-button-container').length - indexFromEnd - 1;
        // history.setIndex(indexFromStart);

        // Get items
        const receipt = history.getReceipt(indexFromStart);
        const items = receipt.items;

        // Populate receipt node with items
        UserInterface.addItemsToReceipt(items, 'history-receipt');

        // Show return button
        UserInterface.showReturnButton();
    }
}

module.exports = App;
