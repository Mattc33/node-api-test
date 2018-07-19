const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/orders');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Order.find()
    .select('productId quantity _id')
    .populate('product', 'name') // * populate all product information
    .exec()
    .then(result => {
        res.status(200).json({
            count: result.quantity,
            orders: result.map( result => {
                return {
                    id: result._id,
                    product: result.productId,
                    quantity: result.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + result._id
                    }
                }
            }),
        });
    })
    .catch(error => {
        res.status(500).json({
            error: error
        })
    })
});

router.post('/', (req, res, next) => {
    // * prevent orders for products you don't have
    Product.findById(req.body.productId)
        .then(product => {
            // * check if product exists
            if(!product) {
                return res.status(404).json({
                    message: 'product not found'
                });
            }
            const order = new Order({ // * how I define a new order obj
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                productId: req.body.productId // * id of product I connect to
            });
            return order.save()
        })
        .then(result => { // * chain another then block to handle succesful post
            console.log(result);
            res.status(201).json({
                message: 'order stored',
                createdOrder: {
                    _id: result.__id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders/" + result._id
                }
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Product not found',
                error: error
            });
        });
});

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found'
                });
            }
            res.status(200).json({
                order: {
                    quantity: order.quantity,
                    orderId: order._id,
                    productId: order.productId
                },
                request: {
                    type: 'GET',
                    url: 'http://localhosthost:2000/orders'
                }
            });
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        })
});

router.delete('/:orderId', (req, res, next) => {
    Order.remove({_id: req.params.orderId})
        .exec()
        .then(
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders',
                    body: {
                        productId: 'ID',
                        quantity: 'Number'
                    }
                }
            })
        )
        .catch(error => {
            res.status(500).json({
                error: error
            });
        })
});

module.exports = router; // * make sure router is exported and can be used by other files



