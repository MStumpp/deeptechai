
'use strict';
let express = require("express")
let app = express();
let swaggerTools = require('swagger-tools');
let jsyaml = require('js-yaml');
let fs = require('fs');
let serverPort = 8080;

const _ = require('lodash')
const co = require('co')

const mongoose = require('mongoose');

const PositionHistory = require('./api/models/positionHistory');

// swaggerRouter configuration
var options = {
    swaggerUi: '/swagger.json',
    controllers: './api/controllers',
    useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync('./api/swagger/swagger.yaml', 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.all('/', function(req, resp) {
    resp.redirect('/docs');
});

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function(middleware) {
    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());

    // Validate Swagger requests
    app.use(middleware.swaggerValidator());

    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options));

    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi());

    //mongoose.connect('mongodb://sm2bc.documents.azure.com:10255/sm2bc?ssl=true', {
    mongoose.connect('mongodb://localhost:27017/trumpf', {})
    .then(() => { 
        console.log('connection successful')
        //run()
    })
    .catch((err) => console.error(err));

    //initDb()

    // Start the server
    app.listen(serverPort, function() {
        console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
        console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
    });
});

module.exports = app