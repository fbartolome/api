const Product = require('../models/product');
const url     = require('url')

var products = [];

const index = (req, res) => {
    var urlParts = url.parse(req.url, true);

    var searchVal = urlParts.query.search;
    var stockChecked = false;
    var noStockChecked = false;
    var stockVal = undefined;
    if(urlParts.query.stock === "true"){
        stockVal = true;
        stockChecked = true;
    } else if(urlParts.query.stock === "false"){
        stockVal = false;
        noStockChecked = true;
    }

    Product.searchProducts({
        name: searchVal,
        stock: stockVal
    }, (err, data) => {
        if(data){
            res.render('index', {
                title: 'API',
                products: data,
                search: searchVal,
                stockChecked: stockChecked,
                noStockChecked: noStockChecked
            });
        } else {
            res.render('index', {
                title: 'API',
                products: []
            });
        }
    });
};

module.exports = {
    index
};

