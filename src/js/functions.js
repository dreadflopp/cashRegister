exports.test = function() {


  addToReceipt({seller:12, price:100, discount:0}, 'receipt')
  addToReceipt({seller:11, price:79, discount:50}, 'receipt')
  addToReceipt({seller:2, price:78, discount:25}, 'receipt')
  addToReceipt({seller:5, price:10, discount:0}, 'receipt')
}

function financial(x) {
  return Number.parseFloat(x).toFixed(2);
}

function init() {
  // add event listeners
  document.getElementById('button-add-item').addEventListener('click', parseForm, false);
}

// Connect the main function to window load event
window.addEventListener("load", init, false);

function validateForm() {

  // variables
  let validPrice = false
  let validSeller = false
  let validDiscount = false

  // DOM elements
  let sellerElement = document.getElementById('seller')
  let priceElement = document.getElementById('price')
  let discountElement = document.getElementById('discount')
  let isDiscountedElement = document.getElementById('is-discounted')

  // Remove invalid classes
  sellerElement.classList.remove('invalid')
  priceElement.classList.remove('invalid')
  discountElement.classList.remove('invalid')

  // Validate seller
  let seller = sellerElement.value
  if (seller) {
    seller = seller.trim();
    if (/^[1-9][0-9]*$/.test(seller)) {
      validSeller = true;
    }
  }

  // Validate price
  let price = priceElement.value
  if (price) {
    price = price.trim();
    if (/^[0-9]+([.|,][0-9]{1,2})?$/.test(price)) {
      validPrice = true;
    }
  }

  // Validate discounted
  if (isDiscountedElement.checked) {
    let discount = discountElement.value
    if (discount) {
      discount = discount.trim()
      if (/^[1-9][0-9]*$/.test(discount)) {
        validDiscount = true;
      }
    }
  } else {
    validDiscount = true;
  }


  // Add invalid class to invalid fields
  if (!validSeller) {
    sellerElement.classList.add('invalid')
  }

  if (!validPrice) {
    priceElement.classList.add('invalid')
  }

  if (!validDiscount) {
    discountElement.classList.add('invalid')
  }

  // Return result
  if (validSeller && validPrice && validDiscount) {
    return true;
  } else {
    return false;
  }
}

function parseForm() {
  if (validateForm()) {

    // DOM elements
    let sellerElement = document.getElementById('seller')
    let priceElement = document.getElementById('price')
    let discountElement = document.getElementById('discount')
    let isDiscountedElement = document.getElementById('is-discounted')

    // values
    let seller = sellerElement.value
    let price = priceElement.value
    let discount = 0
    if (isDiscountedElement.checked) {
      discount = discountElement.value
    }

    // Create purchaseData
    let purchaseData = {seller:seller, price:price, discount:discount}

    // add to receipt
    addToReceipt(purchaseData, 'receipt')

    return true
  } else {
    return false;
  }
}

function addToReceipt(purchaseData, receiptId) {

  // Get receipt
  let receipt = document.getElementById(receiptId)

  // Make sure placeholder is hidden
  let placeholder = receipt.getElementsByClassName('receipt-placeholder')[0]
  placeholder.classList.add('hidden')

  // create item
  let item = itemBuilder(purchaseData.seller, purchaseData.price, purchaseData.discount)

  // get content node
  let contentNode = receipt.getElementsByClassName('receiptContent')[0]

  // append item
  contentNode.appendChild(item)

  // Make sure sum-container isn't hidden
  let sumContainer = receipt.getElementsByClassName('sum-container')[0]
  sumContainer.classList.remove('hidden')

  // update sum
  let sumField = receipt.getElementsByClassName('receipt-sum')[0]
  sumField.innerText = financial(calculateSum(receiptId))
}

function calculateSum(receiptId) {
  // get elements
  let receipt = document.getElementById(receiptId)
  let placeholder = receipt.getElementsByClassName('receipt-placeholder')[0]
  let sumContainer = receipt.getElementsByClassName('sum-container')[0]
  let sumField = receipt.getElementsByClassName('receipt-sum')[0]
  let receiptContent = receipt.getElementsByClassName('receipt-content')[0]

  // get all items
  let items = receipt.getElementsByClassName('item')

  // calculate sum
  let sum = 0

  for (let item of items) {
    let priceNode = item.getElementsByClassName('price')[0]
    let discountNode = item.getElementsByClassName('discount')[0]
    let price = 0
    price = Number(priceNode.innerText) - Number(priceNode.innerText) * Number(discountNode.innerText) / 100

    sum += price
  }
  return sum
}

function itemBuilder(sellerValue, priceValue, discountPercentValue) {

  // item related elements
  let item = document.createElement('div')
  item.classList.add('item')

  // create rows
  let firstRow = document.createElement('div')
  firstRow.classList.add('receiptFirstRow')
  let secondRow = document.createElement('div')
  secondRow.classList.add('receiptSecondRow')
  item.appendChild(firstRow)
  item.appendChild(secondRow)

  // create divs in rows to style text and ammount
  let firstRowLeft = document.createElement('div')
  firstRowLeft.classList.add('left')
  let firstRowRight = document.createElement('div')
  firstRowRight.classList.add('right')
  let secondRowLeft = document.createElement('div')
  secondRowLeft.classList.add('left')
  let secondRowRight = document.createElement('div')
  secondRowRight.classList.add('right')
  firstRow.appendChild(firstRowLeft)
  firstRow.appendChild(firstRowRight)
  secondRow.appendChild(secondRowLeft)
  secondRow.appendChild(secondRowRight)

  // create first row elements
  let sellerDesc = document.createElement('span')
  sellerDesc.innerText = 'Säljare '
  firstRowLeft.appendChild(sellerDesc)

  let seller = document.createElement('span')
  seller.innerText = sellerValue
  seller.classList.add('seller')
  firstRowLeft.appendChild(seller);
/*
  let priceDesc = document.createElement('span')
  priceDesc.innerText = ' Pris'
  firstRowLeft.appendChild(priceDesc)
*/
  let priceSign = document.createElement('span')
  priceSign.innerText = '+'
  firstRowRight.appendChild(priceSign)

  let price = document.createElement('span')
  price.innerText = financial(priceValue)
  price.classList.add('price')
  firstRowRight.appendChild(price)

  // create second row elements
  let discountDescPre = document.createElement('span')
  discountDescPre.innerText = '    *** Rabatt '
  secondRowLeft.appendChild(discountDescPre)

  let discountPercent = document.createElement('span')
  discountPercent.innerText = discountPercentValue
  discountPercent.classList.add('discount')
  secondRowLeft.appendChild(discountPercent)

  let discountDescPost = document.createElement('span')
  discountDescPost.innerText = '% ***   '
  secondRowLeft.appendChild(discountDescPost)

  let discountSign = document.createElement('span')
  discountSign.innerText = '-'
  secondRowRight.appendChild(discountSign)

  let discount = document.createElement('span')
  discount.innerText = financial(Number(priceValue) * Number(discountPercentValue) / 100)
  secondRowRight.appendChild(discount)

  // Hide second row if discount equals 0
  if (Number(discountPercentValue) == 0) {
    secondRow.classList.add('hidden')
  }

  return item
}
