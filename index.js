const express = require('express');
const { resolve } = require('path');
let cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;

app.use(express.static('static'));

// server-side values
let taxRate = 5; //5 %
let discountPercentage = 10; // 10 %
let loyaltyRate = 2; //2 points per $1

//API 1 -

function totalCartPrice(newItemPrice, cartTotal) {
  const totalCartPrice = newItemPrice + cartTotal;
  return totalCartPrice.toString();
}

app.get('/cart-total', (req, res) => {
  const newItemPrice = parseFloat(req.query.newItemPrice);
  const cartTotal = parseFloat(req.query.cartTotal);

  res.send(totalCartPrice(newItemPrice, cartTotal));
});

//API 2 -

function totalCartValue(cartTotal, isMember) {
  let discountedValue;
  if (isMember) {
    discountedValue = cartTotal - (cartTotal * discountPercentage) / 100;
  } else {
    return cartTotal.toString();
  }
  return discountedValue.toString();
}

app.get('/membership-discount', (req, res) => {
  const cartTotal = parseFloat(req.query.cartTotal);
  const isMember = req.query.isMember === 'true';

  res.send(totalCartValue(cartTotal, isMember));
});

//API 3 -

function calculateTotalTaxPrice(cartTotal) {
  if (isNaN(cartTotal)) {
    return 'Inavlid input';
  }
  return cartTotal * (taxRate / 100);
}

app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);

  let totalPrice = calculateTotalTaxPrice(cartTotal);
  res.send(totalPrice.toString());
});

//API 4 -

function findNoOfDays(shippingMethod, distance) {
  if (isNaN(distance)) {
    return 'Invalid inputs';
  }

  let daysTook;
  if (shippingMethod === 'Standard') {
    daysTook = Math.ceil(distance / 50);
  } else if (shippingMethod === 'Express') {
    daysTook = Math.ceil(distance / 100);
  } else {
    res.status(400).send('Please enter valid shipping method');
  }
  return daysTook.toString();
}

app.get('/estimate-delivery', (req, res) => {
  let shippingMethod = req.query.shippingMethod;
  let distance = parseFloat(req.query.distance);

  let noOfDays = findNoOfDays(shippingMethod, distance);
  res.send(noOfDays);
});

//API 5 -

function calculateShippingCost(weight, distance) {
  return weight * distance * 0.1;
}

app.get('/shipping-cost', (req, res) => {
  let weight = parseFloat(req.query.weight);
  let distance = parseFloat(req.query.distance);

  if (isNaN(weight) || isNaN(distance)) {
    res.status(400).send('Invalid inputs');
  }

  let shippingCost = calculateShippingCost(weight, distance);
  res.send(shippingCost.toString());
});

//API 6 -

app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);

  let pointsEarned = purchaseAmount * loyaltyRate;
  res.send(pointsEarned.toString());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
