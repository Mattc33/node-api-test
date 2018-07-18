const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/orders');

router.get('/', (req, res, next) => {
    Order.find()
    .select('productId quantity _id')
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
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        productId: req.body.productId // * id of product I connect to
    });
    order.save()
    .then(result => {
        console.log(result);
        res.status(201).json(result);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error: error});
    })
});

router.get('/:orderId', (req, res, next) => {
    res.status(201).json({
        message: 'Order details',
        orderId: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(201).json({
        message: 'Orders was deleted',
        orderId: req.params.orderId
    });
});

module.exports = router; // * make sure router is exported and can be used by other files



