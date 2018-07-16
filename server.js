const express = require('express');
const app = express();
const port = process.env.PORT || 2000; // Either get port from env variable or hardcoded

const routes = require('./api/routeHandler');
routes(app); // routes is an imported fn that takes in the express() fn as a var

app.listen(port);
console.log(`server started on port:${port}`);