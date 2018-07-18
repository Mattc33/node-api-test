const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(result => {
            console.log(`==> From DataBase: ${result}`);
            if (result) {
                res.status(200).json(result);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.post('/', (req, res, next) => {
    // * store data
    const product = new Product({ // * obj to pass data, Product is a contructor
        _id: new mongoose.Types.ObjectId(), // * creates unique id
        name: req.body.name,
        price: req.body.price
    });

    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({ // * status code of 201 is industry standard for a succesful post
                message: 'Handling POST requests to /products',
                product: product
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });

});

router.get('/:productId', (req, res, next) => { // * semicolon indicates a parameter
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(result => {
            console.log(`==> From DataBase: ${result}`);
            // * send res from the then block when u know you gotten the data
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(400).json({
                    message: "No valid entry found for provided ID"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
        // * since the above code is asynchronous
        // * code I write here will execute immediately and won't wait for the async code to finish

});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId; 
    const updateOps = {}; // * check if you do want to update all props in obj
    for (const ops of req.body) { // * this loop is checking for every option in req.body which is an array add that key value pair to the empty obj updateOps
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, { $set: updateOps }) 
    // * 2nd arg describes how you want to change this obj mongoose understands the $set signifier, it then takes an obj containing the key-value pairs u want to edit
        .exec()                            
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({error: error});
        })
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id}) // * pass in the filter criteria, remove all obj in db with the property _id: id
        .exec() // * to get a real promise
        .then(result => {
            // if (result.length >= 0) {
                res.status(200).json({message: `succesfully deleted ${id}`});
            // } else {
            //     res.status(404).json({message: 'No entries found'})
            // }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                error: error
            });
        });
});

module.exports = router; // * make sure router is exported and can be used by other files



