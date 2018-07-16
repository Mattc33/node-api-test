const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({ // * status code of 201 is industry standard for a succesful post
        message: 'Handling POST requests to /products'
    });
});

router.get('/:productId', (req, res, next) => { // * semicolon indicates a parameter
    const id = req.params.productId;
    if (id === 'special') {
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        })
    } else {
        res.status(200).json({
            message: 'Handling GET requests to /products:productId',
            id: id
        })
    }
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        message: 'Updated product!',
        id: id
    });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        message: 'Deleted product!',
        id: id
    });
});

module.exports = router; // * make sure router is exported and can be used by other files



