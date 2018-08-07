/* eslint-disable no-trailing-spaces */

function financial(x) {
    return Number.parseFloat(x).toFixed(2);
}

function calculateSum(receiptId) {
    // get elements
    const receipt = document.getElementById(receiptId);

    // get all items
    const items = receipt.getElementsByClassName('item');

    // calculate sum
    let sum = 0;

    Array.from(items).forEach((item) => {
        const basePrice = Number(item.getElementsByClassName('price')[0].innerText);
        const discount = Number(item.getElementsByClassName('discount')[0].innerText);
        sum += basePrice - (basePrice * (discount / 100));
    });
    return sum;
}

function resetEditArea(receiptId) {
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

function clearReceipt(receiptId) {
    // Get receipt
    const receipt = document.getElementById(receiptId);

    // Reset the edit area
    resetEditArea(receiptId);

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

function deleteItemButtonHandler() {
    // Get item node
    const itemNode = this.parentNode.parentNode.parentNode.parentNode;
    const receiptId = itemNode.parentNode.parentNode.id;
    const receipt = document.getElementById(receiptId);

    // Delete node
    itemNode.parentNode.removeChild(itemNode);

    if (receipt.getElementsByClassName('item').length > 0) {
        // Calculate sum
        calculateSum(receiptId);

        // update sum
        const sumField = receipt.getElementsByClassName('receipt-sum')[0];
        sumField.innerText = financial(calculateSum(receiptId));
    } else {
        clearReceipt(receiptId);
        // Hide add-to-history button
        document.getElementById('button-add-to-history').classList.add('hidden');
    }
}

function itemBuilder(sellerValue, priceValue, discountPercentValue) {
     // item related elements
    const item = document.createElement('div');
    item.classList.add('item');

    // create rows
    const firstRow = document.createElement('div');
    firstRow.classList.add('receiptFirstRow');
    const secondRow = document.createElement('div');
    secondRow.classList.add('receiptSecondRow');
    item.appendChild(firstRow);
    item.appendChild(secondRow);

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
    deleteItemButton.addEventListener('click', deleteItemButtonHandler, false);
    const deleteButtonContainer = document.createElement('div');
    deleteButtonContainer.classList.add('delete-item-button-container');
    deleteButtonContainer.appendChild(deleteItemButton);
    firstRowLeft.appendChild(deleteButtonContainer);

    const sellerDesc = document.createElement('span');
    sellerDesc.innerText = 'Säljare ';
    firstRowLeft.appendChild(sellerDesc);

    const seller = document.createElement('span');
    seller.innerText = sellerValue;
    seller.classList.add('seller');
    firstRowLeft.appendChild(seller);

    const priceSign = document.createElement('span');
    priceSign.innerText = '+';
    firstRowRight.appendChild(priceSign);

    const price = document.createElement('span');
    price.innerText = financial(priceValue);
    price.classList.add('price');
    firstRowRight.appendChild(price);

    // create second row elements
    const discountDescPre = document.createElement('span');
    discountDescPre.innerText = '    *** Rabatt ';
    secondRowLeft.appendChild(discountDescPre);

    const discountPercent = document.createElement('span');
    discountPercent.innerText = discountPercentValue;
    discountPercent.classList.add('discount');
    secondRowLeft.appendChild(discountPercent);

    const discountDescPost = document.createElement('span');
    discountDescPost.innerText = '% ***   ';
    secondRowLeft.appendChild(discountDescPost);

    const discountSign = document.createElement('span');
    discountSign.innerText = '-';
    secondRowRight.appendChild(discountSign);

    const discount = document.createElement('span');
    discount.innerText = financial(Number(priceValue) * (Number(discountPercentValue) / 100));
    secondRowRight.appendChild(discount);

    // Hide second row if discount equals 0
    if (Number(discountPercentValue) === 0) {
        secondRow.classList.add('hidden');
    }

    return item;
}


const history = (function () {
    const receipts = [];
    let index = -1;

    const addReceipt = function (items) {
        if (items.length > 0) {
            // create time string
            const now = new Date();
            const timeString = now.toLocaleString('sv-SE');

            // Create receipt object
            const receipt = [];
            receipt.time = timeString;
            receipt.items = items;
            receipts.push(receipt);

            return timeString;
        }
        return false;
    };

    const toConsole = function () {
        let str = '';
        receipts.forEach((receipt) => {
            str += `Time: ${receipt.time}\n`;
            receipt.items.forEach((item) => {
                str += `Seller: ${item.seller} Price: ${item.price} Discount: ${item.discount}\n`;
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

    const getIndex = function () { return index; }
    const setIndex = function (newIndex) { index = newIndex; }
    const resetIndex = function () { index = -1; }

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

function validateForm() {
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

function addToReceipt(purchaseData, receiptId) {
    // Get receipt
    const receipt = document.getElementById(receiptId);

    // Reset the edit area
    resetEditArea(receiptId);

    // Show the edit area
    if (receipt.getElementsByClassName('receipt-edit-area').length > 0) {
        const editArea = receipt.getElementsByClassName('receipt-edit-area')[0];
        editArea.classList.remove('hidden');
    }

    // Make sure placeholder is hidden
    const placeholder = receipt.getElementsByClassName('receipt-placeholder')[0];
    placeholder.classList.add('hidden');

    // create item
    const item = itemBuilder(purchaseData.seller, purchaseData.price, purchaseData.discount);

    // get content node
    const contentNode = receipt.getElementsByClassName('receiptContent')[0];

    // append item
    contentNode.appendChild(item);

    // Make sure sum-container isn't hidden
    const sumContainer = receipt.getElementsByClassName('sum-container')[0];
    sumContainer.classList.remove('hidden');

    // update sum
    const sumField = receipt.getElementsByClassName('receipt-sum')[0];
    sumField.innerText = financial(calculateSum(receiptId));
}

exports.test = () => {
    addToReceipt({ seller: 12, price: 100, discount: 0 }, 'receipt');
    addToReceipt({ seller: 11, price: 79, discount: 50 }, 'receipt');
    addToReceipt({ seller: 2, price: 78, discount: 25 }, 'receipt');
    addToReceipt({ seller: 5, price: 10, discount: 0 }, 'receipt');

    // Show add to history button
    document.getElementById('button-add-to-history').classList.remove('hidden');
};

function parseForm() {
    if (validateForm()) {
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

        // Create purchaseData
        const purchaseData = { seller, price, discount };

        // add to receipt
        addToReceipt(purchaseData, 'receipt');

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

function editButtonHandler() {
    // Hide edit button
    this.classList.add('hidden');

    // Show done button
    const doneButton = this.parentNode.getElementsByClassName('receipt-done-button')[0];
    doneButton.classList.remove('hidden');

    // Show delete button
    const deleteButton = this.parentNode.parentNode.getElementsByClassName('receipt-delete-button')[0];
    deleteButton.classList.remove('hidden');

    // Show delete item buttons
    const receiptId = this.parentNode.parentNode.parentNode.id;
    const receipt = document.getElementById(receiptId);
    const deleteItemButtons = receipt.getElementsByClassName('delete-item-button');
    Array.from(deleteItemButtons).forEach((button) => {
        button.classList.remove('hidden');
//        const container = button.parentNode;
//        container.style.padding = '0px';
    });
}

function doneButtonHandler() {
    // Get receipt id
    const receiptId = this.parentNode.parentNode.parentNode.id;

    // Reset edit area
    resetEditArea(receiptId);
}

function deleteButtonHandler() {
    // Get receipt id
    const receiptId = this.parentNode.parentNode.parentNode.id;

    // Clear receipt
    clearReceipt(receiptId);

    // Hide add-to-history button
    document.getElementById('button-add-to-history').classList.add('hidden');
}

function focusResetHandler() {
    const seller = document.getElementById('seller');
    seller.focus();
}

function receiptSelectedHandler() {
    // Clear receipt
    clearReceipt('history-receipt');

    // Unhide the selected receipt area
    document.getElementById('history-receipt').classList.remove('transparent');

    // Get index of selected container
    const selected = this.parentNode;
    const parent = selected.parentNode;
    const indexFromEnd = Array.prototype.indexOf.call(parent.children, selected);
    const indexFromStart = document.getElementsByClassName('radio-button-container').length - indexFromEnd - 1;
    history.setIndex(indexFromStart);

    // Get items
    const receipt = history.getReceipt(indexFromStart);
    const items = receipt.items;

    // Populate receipt
    items.forEach((item) => {
        addToReceipt(item, 'history-receipt');
    });

    // Show return button
    document.getElementById('return-button').classList.remove('hidden');
}

function addToHistoryHandler() {
    // Collect all items
    const items = [];
    const receiptNode = document.getElementById('receipt');
    const itemsNode = receiptNode.getElementsByClassName('item');
    Array.from(itemsNode).forEach((itemNode) => {
        const item = [];
        item.seller = itemNode.getElementsByClassName('seller')[0].innerText;
        item.price = itemNode.getElementsByClassName('price')[0].innerText;
        item.discount = itemNode.getElementsByClassName('discount')[0].innerText;
        items.push(item);
    });
    const result = history.addReceipt(items);
    if (result !== false) {
        // Hide placeholder
        const placeholder = document.getElementById('history-list-placeholder');
        placeholder.classList.add('hidden');

        const radioLabel = document.createElement('label');
        radioLabel.classList.add('radio-button-container');
        radioLabel.innerText = result;
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
        radioInput.addEventListener('click', receiptSelectedHandler, false);

        // clear receipt
        clearReceipt('receipt');

        // Hide add-to-history button
        document.getElementById('button-add-to-history').classList.add('hidden');
    }
}

function closeButtonHandler() {
    clearReceipt('history-receipt');
    this.parentNode.parentNode.classList.add('transparent');

    const allRadioButtons = document.getElementsByClassName('receipt-list-element');
    Array.from(allRadioButtons).forEach((button) => {
// eslint-disable-next-line no-param-reassign
        button.checked = false;
    });

    // Hide return button
    document.getElementById('return-button').classList.add('hidden');
}

function init() {
    // add event listeners
    document.getElementById('button-add-item').addEventListener('click', parseForm, false);
    const editButtons = document.getElementsByClassName('receipt-edit-button');
    Array.from(editButtons).forEach((button) => {
        button.addEventListener('click', editButtonHandler, false);
    });
    const doneButtons = document.getElementsByClassName('receipt-done-button');
    Array.from(doneButtons).forEach((button) => {
        button.addEventListener('click', doneButtonHandler, false);
    });
    const deleteButtons = document.getElementsByClassName('receipt-delete-button');
    Array.from(deleteButtons).forEach((button) => {
        button.addEventListener('click', deleteButtonHandler, false);
    });
    const focusReset = document.getElementById('focus-reset');
    focusReset.addEventListener('focus', focusResetHandler, false);

    const buttonAddToHistory = document.getElementById('button-add-to-history');
    buttonAddToHistory.addEventListener('click', addToHistoryHandler, false);

    const closeButton = document.getElementById('close-button');
    closeButton.addEventListener('click', closeButtonHandler, false);
}

// Connect the main function to window load event
window.addEventListener('load', init, false);
