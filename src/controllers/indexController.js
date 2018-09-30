const Product = require('../models/product');
const url = require('url');
const axios = require('axios');
const config = require('../../config/config');

const indexController = (req, res) => {
    var urlParts = url.parse(req.url, true);

    var searchVal = urlParts.query.search;
    var stockChecked = false;
    var noStockChecked = false;
    var stockVal = undefined;
    var orderVarVal = urlParts.query.order;
    var orderDirVal = urlParts.query.direction;

    if (urlParts.query.stock === "true") {
        stockVal = true;
        stockChecked = true;
    } else if (urlParts.query.stock === "false") {
        stockVal = false;
        noStockChecked = true;
    }

    axios.get('http://' + config.host + ':' + config.port + '/products', {
        params: {
            name: searchVal,
            stock: stockVal,
            orderby: orderVarVal,
            direction: orderDirVal
        }
    })
        .then(data => {
            var ordering = {
                orderby: orderVarVal,
                direction: orderDirVal,
                product: {
                    direction: "top",
                    color: "black"
                },
                stock: {
                    direction: "top",
                    color: "black"
                }
            };
            setOrderingView(ordering, orderVarVal, orderDirVal);

            res.render('index', {
                title: 'API',
                products: data.data,
                search: searchVal,
                stockChecked: stockChecked,
                noStockChecked: noStockChecked,
                ordering: ordering
            });
        })
        .catch(err => {
            console.log(err);
        });

};

function setOrderingView(orderData, orderVarVal, orderDirVal) {
    if (orderVarVal === "stock") {
        orderData.stock.color = "red";
        if (orderDirVal === "desc") {
            orderData.stock.direction = "bottom";
        }
    } else {
        orderData.product.color = "red";
        if (orderDirVal === "desc") {
            orderData.product.direction = "bottom";
        }
    }
}

module.exports = {
    index: indexController
};

