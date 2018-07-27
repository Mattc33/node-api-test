const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');

mongoose.connect( // * using mongoose to connect to MongoDB Atlas
    `mongodb+srv://mattc3303:${process.env.MONGO_ATLAS_PW}@matttestcluster-vvajl.gcp.mongodb.net/test?retryWrites=true`,
    {
        useMongoClient: true
    }
);
mongoose.Promise = global.Promise;

module.exports = (app) => {
    app.use(morgan('combined')); // * morgan is a 3rd party logging lib
    app.use('/uploads/', express.static('uploads')); // * make the uploads folder static so it can be accessed publicly
    app.use(bodyParser.urlencoded({extended: false})); // * which kind of bodies do you want to parse? urlencoded, extended true gives u ability to parse data with rich data
    app.use(bodyParser.json()); // * extract json data and makes it readable for us

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*'); // * gives access to any origin, or you can define specific origins like https://my-client-site.com
        res.header(
            'Access-Control-Allow-Headers', 
            'Origin, X-Requested-With, Content-Type, Accept, Authroization'
        );
        // * check if the incoming req method has Options
        if (req.method === 'OPTIONS') {
            // * additonal header telling browser what he may send
            // * these are an initial res from the browser req to tell them what options they can use
            res.header('Access-Control-Allow-Origin', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }
        // * you need to pass off this req handler so the rest of your route handlers can function
        next();
    });

    // ? Routes to handle Requests
    app.use('/products', productRoutes);
    app.use('/orders', orderRoutes);
    app.ise('/users', userRoutes);

    app.use((req, res, next) => {
        const error = new Error('Not Found'); // * If no routes match then produce a 404
        res.status(404); // * a 404 is standard practice for a address that has nothing
        next(error); // * This will forward this request(error)
    });

    app.use((error, req, res, next) => {
        // * return a 500 error if a DB error occurs
        res.status(error.status || 505);
        res.json({
            error: {
                message: error.message // * Would be 'Not Found' as defined above
            }
        });
    });


}
