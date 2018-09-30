const express = require('express');
const path = require('path');
const app = express();
const config = require('../config/config');

const morgan = require('morgan');
const bodyParser = require('body-parser');

// settings
app.set('port', config.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// routes
require('./routes/productRoutes')(app);
require('./routes/indexRoutes')(app);

// static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
    console.log("server on port " + config.port);
});