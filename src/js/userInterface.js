/* eslint-disable no-trailing-spaces */
const financial = require('./utility_functions');
const init = require('./init');
const Receipt = require('./receipt');
const Item = require('./item');
const App = require('./app');

class UserInterface {
    static clearReceipt(receiptId) {
        // Get receipt
        const receipt = document.getElementById(receiptId);

        // Reset the edit area
        UserInterface.resetEditArea(receiptId);

        // Hide the edit area
        if (receipt.getElementsByClassName('receipt-edit-area').length > 0) {
            const editArea = receipt.getElementsByClassName('receipt-edit-area')[0];
            editArea.classList.add('hidden');
        }

        // Show the placeholder
        const placeholder = receipt.getElementsByClassName('receipt-placeholder')[0];
        placeholder.classList.remove('hidden');

        // get content node
        const contentNode = receipt.getElementsByClassName('receiptContent')[0];

        // Clear the content node = remove all items
        contentNode.innerText = '';

        // Clear sum
        const sumContainer = receipt.getElementsByClassName('sum-container')[0];
        const sumField = sumContainer.getElementsByClassName('receipt-sum')[0];
        sumField.innerText = '';
        sumContainer.classList.add('hidden');
    }

    static resetEditArea(receiptId) {
        const receipt = document.getElementById(receiptId);
        if (receipt.getElementsByClassName('receipt-edit-area').length > 0) {
            const editArea = receipt.getElementsByClassName('receipt-edit-area')[0];
            const editButton = editArea.getElementsByClassName('receipt-edit-button')[0];
            const doneButton = editArea.getElementsByClassName('receipt-done-button')[0];
            const deleteButton = editArea.getElementsByClassName('receipt-delete-button')[0];
            const deleteItemButtons = receipt.getElementsByClassName('delete-item-button');

            editButton.classList.remove('hidden');
            doneButton.classList.add('hidden');
            deleteButton.classList.add('hidden');
            Array.from(deleteItemButtons).forEach((button) => {
                button.classList.add('hidden');
            });
        }
    }

    /**
     *
     * @param {Item} item
     * @returns {HTMLDivElement}
     */
    static itemNodeBuilder(item) {
        // item related elements
        const itemNode = document.createElement('div');
        itemNode.classList.add('item');

        // create rows
        const firstRow = document.createElement('div');
        firstRow.classList.add('receiptFirstRow');
        const secondRow = document.createElement('div');
        secondRow.classList.add('receiptSecondRow');
        itemNode.appendChild(firstRow);
        itemNode.appendChild(secondRow);

        // create divs in rows to style text and ammount
        const firstRowLeft = document.createElement('div');
        firstRowLeft.classList.add('left');
        const firstRowRight = document.createElement('div');
        firstRowRight.classList.add('right');
        const secondRowLeft = document.createElement('div');
        secondRowLeft.classList.add('left');
        const secondRowRight = document.createElement('div');
        secondRowRight.classList.add('right');
        firstRow.appendChild(firstRowLeft);
        firstRow.appendChild(firstRowRight);
        secondRow.appendChild(secondRowLeft);
        secondRow.appendChild(secondRowRight);

        // create first row elements
        // Create delete-item-button
        const deleteItemButton = document.createElement('button');
        deleteItemButton.classList.add('delete-item-button');
        deleteItemButton.classList.add('hidden');
        deleteItemButton.innerHTML = '&#x2715';
        deleteItemButton.addEventListener('click', init.deleteItemButtonHandler, false);
        const deleteButtonContainer = document.createElement('div');
        deleteButtonContainer.classList.add('delete-item-button-container');
        deleteButtonContainer.appendChild(deleteItemButton);
        firstRowLeft.appendChild(deleteButtonContainer);

        const sellerDesc = document.createElement('span');
        sellerDesc.innerText = 'Säljare ';
        firstRowLeft.appendChild(sellerDesc);

        const seller = document.createElement('span');
        seller.innerText = item.seller;
        seller.classList.add('seller');
        firstRowLeft.appendChild(seller);

        const priceSign = document.createElement('span');
        priceSign.innerText = '+';
        firstRowRight.appendChild(priceSign);

        const price = document.createElement('span');
        price.innerText = financial(item.price);
        price.classList.add('price');
        firstRowRight.appendChild(price);

        // create second row elements
        const discountDescPre = document.createElement('span');
        discountDescPre.innerText = '    *** Rabatt ';
        secondRowLeft.appendChild(discountDescPre);

        const discountPercent = document.createElement('span');
        discountPercent.innerText = item.discount;
        discountPercent.classList.add('discount');
        secondRowLeft.appendChild(discountPercent);

        const discountDescPost = document.createElement('span');
        discountDescPost.innerText = '% ***   ';
        secondRowLeft.appendChild(discountDescPost);

        const discountSign = document.createElement('span');
        discountSign.innerText = '-';
        secondRowRight.appendChild(discountSign);

        const discount = document.createElement('span');
        discount.innerText = financial(item.discountedPrice());
        secondRowRight.appendChild(discount);

        // Hide second row if discount equals 0
        if (Number(item.discount) === 0) {
            secondRow.classList.add('hidden');
        }

        return itemNode;
    }

    /**
     *
     * @param {Item} item
     * @param {string} receiptId
     */
    static addItemToReceipt(item, receiptId) {
        // Get receipt node
        const receiptNode = document.getElementById(receiptId);

        // Reset the edit area
        this.resetEditArea(receiptId);

        // Show the edit area
        if (receiptNode.getElementsByClassName('receipt-edit-area').length > 0) {
            const editArea = receiptNode.getElementsByClassName('receipt-edit-area')[0];
            editArea.classList.remove('hidden');
        }

        // Make sure placeholder is hidden
        const placeholder = receiptNode.getElementsByClassName('receipt-placeholder')[0];
        placeholder.classList.add('hidden');

        // create item
        const itemNode = this.itemNodeBuilder(item);

        // get content node
        const contentNode = receiptNode.getElementsByClassName('receiptContent')[0];

        // append item node
        contentNode.appendChild(itemNode);

        // Make sure sum-container isn't hidden
        const sumContainer = receiptNode.getElementsByClassName('sum-container')[0];
        sumContainer.classList.remove('hidden');

        // update sum
        const sumField = receiptNode.getElementsByClassName('receipt-sum')[0];
        sumField.innerText = financial(Receipt.sum(receiptId));
    }

    static addItemsToReceipt(items, receiptId) {
        items.forEach((item) => {
            this.addItemToReceipt(item, receiptId);
        });
    }

    static showReturnButton() {
        // Show return button
        document.getElementById('return-button').classList.remove('hidden');
    }

    static parseForm() {
        if (App.validateForm()) {
            // DOM elements
            const sellerElement = document.getElementById('seller');
            const priceElement = document.getElementById('price');
            const discountElement = document.getElementById('discount');
            const isDiscountedElement = document.getElementById('is-discounted');

            // values
            const seller = sellerElement.value;
            const price = priceElement.value;
            let discount = 0;
            if (isDiscountedElement.checked) {
                discount = discountElement.value;
            }

            // Create item
            const item = new Item(seller, price, discount);

            // add to receipt
            this.addItemToReceipt(item, 'receipt');

            // Show add to history button
            document.getElementById('button-add-to-history').classList.remove('hidden');

            // empty form
            sellerElement.value = '';
            priceElement.value = '';
            discountElement.value = 50;
            isDiscountedElement.checked = false;
            sellerElement.focus();

            return true;
        }
        return false;
    }

    static closeSelectedReceipt() {
        // reset receipt
        this.clearReceipt('history-receipt');

        // Hide receipt
        document.getElementById('history-receipt').classList.add('transparent');

        // uncheck all radiobuttons
        const allRadioButtons = document.getElementsByClassName('receipt-list-element');
        Array.from(allRadioButtons).forEach((button) => {
// eslint-disable-next-line no-param-reassign
            button.checked = false;
        });

        // Hide return button
        document.getElementById('return-button').classList.add('hidden');
    }

    /**
     *
     * @param {string} receiptId
     * @returns {Item[]}
     */
    static getItemsFromReceipt(receiptId) {
        // Collect all items
        const items = [];
        const receiptNode = document.getElementById(receiptId);
        const itemsNode = receiptNode.getElementsByClassName('item');
        Array.from(itemsNode).forEach((itemNode) => {
            const seller = itemNode.getElementsByClassName('seller')[0].innerText;
            const price = itemNode.getElementsByClassName('price')[0].innerText;
            const discount = itemNode.getElementsByClassName('discount')[0].innerText;
            items.push(new Item(seller, price, discount));
        });

        return items;
    }

    static addRadioButton(title) {
        // Hide placeholder
        const placeholder = document.getElementById('history-list-placeholder');
        placeholder.classList.add('hidden');

        const radioLabel = document.createElement('label');
        radioLabel.classList.add('radio-button-container');
        radioLabel.innerText = title;
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'chosen-receipt';
        const thisReceiptsIndex = document.getElementsByClassName('receipt-list-element').length;
        radioInput.classList.add('receipt-list-element');
        radioInput.id = thisReceiptsIndex;
        const checkmark = document.createElement('span');
        checkmark.classList.add('checkmark');
        radioLabel.appendChild(radioInput);
        radioLabel.appendChild(checkmark);

        const radioButtons = document.getElementById('receipt-radio-buttons');
        radioButtons.insertBefore(radioLabel, radioButtons.firstChild);

        // Create eventlistener
        radioInput.addEventListener('click', init.receiptSelectedHandler, false);

        // clear receipt
        UserInterface.clearReceipt('receipt');

        // Hide add-to-history button
        document.getElementById('button-add-to-history').classList.add('hidden');
    }

    static showReceipt(receiptId) { document.getElementById(receiptId).classList.remove('transparent'); }
    static hideReceipt(receiptId) { document.getElementById(receiptId).classList.add('transparent'); }

    static getSelectedReceipt() {
        // Get all radiobuttons
        const radioButtons = document.getElementById('receipt-radio-buttons');

        // Selected node
        let selectedNode = false;
        /*
        Array.from(radioButtons).forEach((button) => {
            if (button.checked) {
                selectedNode = button.parentNode;
            }
        });
        */
        for (const button of radioButtons) {
            if (button.checked) {
                selectedNode = button.parentNode;
                break;
            }
        }
        return selectedNode;
    }
}

module.exports = UserInterface;
