const url = require('url')
const Product = require('../models/product');

module.exports = function (app) {

    app.get('/products', (req, res) => {
        var urlParts = url.parse(req.url, true);

        var stockVal = undefined;
        if (urlParts.query.stock === "true") {
            stockVal = true;
        } else if (urlParts.query.stock === "false") {
            stockVal = false
        }

        const searchData = {
            name: urlParts.query.name === undefined ? "" : urlParts.query.name,
            stock: stockVal,
            order: {
                variable: urlParts.query.orderby,
                direction: urlParts.query.direction,
            }
        };

        Product.searchProducts(searchData, (err, data) => {
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(500).json({
                    success: false,
                    msg: "error"
                });
            }
        });
    });

    app.post('/products', (req, res) => {
        const productData = {
            productname: req.body.productname,
            stock: req.body.stock
        };

        Product.insertProduct(productData, (err, data) => {
            if (data) {
                if (data.msg === "negative stock") {
                    res.status(400).json({
                        success: false,
                        msg: "negative stock",
                    });
                } else if (data.msg === "already exists") {
                    res.status(400).json({
                        success: false,
                        msg: "product already exists",
                    });
                } else {
                    res.json({
                        success: true,
                        msg: "product inserted",
                        data: data
                    });
                }
            } else {
                res.status(500).json({
                    success: false,
                    msg: "error"
                })
            }
        });

    });

    app.put('/products/:id', (req, res) => {
        const stockData = {
            productid: req.params.id,
            stock: req.body.stock
        };

        Product.updateStock(stockData, (err, data) => {
            if (data) {
                if (data.msg === "success") {
                    res.json({
                        success: true,
                        msg: "stock updated",
                        data: data
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        msg: "product not found",
                        data: data
                    });
                }
            } else {
                res.status(500).json({
                    success: false,
                    msg: "error"
                })
            }
        });
    });

    app.delete('/products/:id', (req, res) => {
        const productData = {
            productid: req.params.id
        };

        Product.deleteProduct(productData, (err, data) => {
            if (data && data.msg) {
                res.json({
                    success: true,
                    msg: "product deleted",
                    data: data
                });
            } else {
                res.status(500).json({
                    success: false,
                    msg: "error"
                });
            }
        });
    });

};
