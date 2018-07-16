const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

module.exports = (app) => {
    app.use('/products', productRoutes);
    app.use('/orders', orderRoutes);
}
