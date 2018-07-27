const mongoose = require('mongoose');


const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // * create a relation with product.js, type is mongoose schema, reference is the string of the model name
    quantity: { type: Number, default: 1}, // * if you pass me nothing defaults to 1

});

module.exports = mongoose.model('Order', orderSchema);
