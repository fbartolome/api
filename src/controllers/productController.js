const url = require('url');
const Product = require('../models/product');

const searchProducts = (req, res) => {
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
};

const newProduct = (req, res) => {
    // validations
    if (req.body.stock === undefined || req.body.productname === undefined) {
        return res.status(422).json({
            success: false,
            msg: "body parameter absent",
        });
    }

    var stock = parseInt(req.body.stock);
    if (isNaN(stock)) {
        return res.status(422).json({
            success: false,
            msg: "stock value is not a number",
        });
    }
    if (stock < 0) {
        return res.status(422).json({
            success: false,
            msg: "negative stock",
        });
    }

    Product.getProductByName(req.body.productname, (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                msg: "error"
            })
        } else {
            if (data.length !== 0) {
                return res.status(422).json({
                    success: false,
                    msg: "product already exists",
                });
            }
        }

        const productData = {
            productname: req.body.productname,
            stock: stock
        };

        Product.insertProduct(productData, (err, data) => {
            if (data) {
                res.json({
                    success: true,
                    msg: "product inserted",
                    data: data
                });
            } else {
                res.status(500).json({
                    success: false,
                    msg: "error"
                })
            }
        });
    });
};

const deleteProduct = (req, res) => {
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
};

const updateStock = (req, res) => {
    // validations
    if (req.body.stock === undefined) {
        return res.status(422).json({
            success: false,
            msg: "body parameter absent",
        });
    }

    var stock = parseInt(req.body.stock);
    if (isNaN(stock)) {
        return res.status(422).json({
            success: false,
            msg: "stock value is not a number",
        });
    }

    Product.getProductById(req.params.id, (err, row) => {
        if (err) {
            return res.status(500).json({
                success: false,
                msg: "error"
            })
        } else {
            if (row.length === 0) {
                return res.status(422).json({
                    success: false,
                    msg: "product doesn't exist",
                });
            }

            var newStock = row[0].stock + stock <= 0 ? 0 : row[0].stock + stock;

            const stockData = {
                productid: req.params.id,
                stock: newStock
            };

            Product.updateStock(stockData, (err, data) => {
                if (data) {
                    if (data.msg === "success") {
                        res.json({
                            success: true,
                            msg: "stock updated",
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
        }
    });
};

module.exports = {
    searchProducts,
    newProduct,
    deleteProduct,
    updateStock,
};

