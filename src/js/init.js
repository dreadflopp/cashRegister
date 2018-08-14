/* eslint-disable no-trailing-spaces */
const financial = require('./utility_functions');
const history = require('./history');
const Item = require('./item');
const Receipt = require('./receipt');
const UserInterface = require('./userInterface');
const App = require('./app');

exports.deleteItemButtonHandler = function () {
    // Get item node
    const itemNode = this.parentNode.parentNode.parentNode.parentNode;
    const receiptId = itemNode.parentNode.parentNode.id;
    const receipt = document.getElementById(receiptId);

    // Delete node
    itemNode.parentNode.removeChild(itemNode);

    // if receipt still has items
    if (receipt.getElementsByClassName('item').length > 0) {
        // Calculate sum
        Receipt.sum(receiptId);

        // update sum
        const sumField = receipt.getElementsByClassName('receipt-sum')[0];
        sumField.innerText = financial(Receipt.sum(receiptId));
    } else {
        UserInterface.clearReceipt(receiptId);
        // Hide add-to-history button
        document.getElementById('button-add-to-history').classList.add('hidden');
    }
}
exports.test = () => {
    UserInterface.addItemToReceipt(new Item(11, 12, 0), 'receipt');
    UserInterface.addItemToReceipt(new Item(1, 18, 50), 'receipt');
    UserInterface.addItemToReceipt(new Item(111, 200, 25), 'receipt');
    UserInterface.addItemToReceipt(new Item(21, 110, 0), 'receipt');

    // Show add to history button
    document.getElementById('button-add-to-history').classList.remove('hidden');
};
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
    UserInterface.resetEditArea(receiptId);
}

function deleteButtonHandler() {
    // Get receipt id
    const receiptId = this.parentNode.parentNode.parentNode.id;

    // Clear receipt
    UserInterface.clearReceipt(receiptId);

    // Hide add-to-history button
    document.getElementById('button-add-to-history').classList.add('hidden');
}

function focusResetHandler() {
    const seller = document.getElementById('seller');
    seller.focus();
}

exports.receiptSelectedHandler = function () {
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

    App.showSelectedReceipt();
}

function addToHistoryHandler() {
    // Collect all items
    const items = UserInterface.getItemsFromReceipt('receipt');

    // Add items to new receipt in history
    const time = history.addReceipt(items);

    // If succesfully added, add radio button
    if (time !== false) {
        UserInterface.addRadioButton(time);
    }
}

function closeButtonHandler() { UserInterface.closeSelectedReceipt(); }
function addItemButtonHandler() { UserInterface.parseForm(); }

function init() {
    // add event listeners
    document.getElementById('button-add-item').addEventListener('click', addItemButtonHandler, false);
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
