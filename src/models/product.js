const mysql = require('mysql');
const config = require('../../config/config');

connection = mysql.createConnection({
    host: config.host,
    user: config.dbuser,
    password: config.dbpass,
    database: config.database
});

let productModel = {};

productModel.getProductByName = (productname, callback) => {
    if (connection) {
        connection.query(
            mysql.format(`SELECT * FROM products WHERE productname = ? `, [productname]),
            (err, row) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, row);
                }
            }
        );
    }
};

productModel.getProductById = (productid, callback) => {
    if (connection) {
        connection.query(
            mysql.format(`SELECT * FROM products WHERE productid = ?`, [productid]),
            (err, row) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, row);
                }
            }
        );
    }
};

productModel.searchProducts = (searchData, callback) => {
    if (connection) {
        var q = "SELECT * FROM products WHERE productname LIKE ? ";
        if (searchData.stock === true) {
            q += "AND stock > 0 ";
        } else if (searchData.stock === false) {
            q += "AND stock = 0 ";
        }
        q += " ORDER BY ";

        var order = 'productname';
        if (searchData.order !== undefined && isValidVariable(searchData.order.variable)) {
            order = searchData.order.variable;
        }
        var direction = searchData.order !== undefined && searchData.order.direction === 'desc' ? 'desc' : 'asc';

        q += order + " " + direction;

        q = mysql.format(q, ['%' + searchData.name + '%']);

        connection.query(
            q, (err, rows) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, rows);
                }
            }
        );
    }
};

productModel.insertProduct = (productData, callback) => {
    if (connection) {
        connection.query(
            "INSERT INTO products SET ?", productData,
            (err, result) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, {
                        "msg": "success",
                        "insertId": result.insertId
                    });
                }
            }
        );
    }
};

productModel.updateStock = (stockData, callback) => {
    if (connection) {
        connection.query(
            mysql.format(`UPDATE products SET stock = ? ` +
                `WHERE productid = ?`, [stockData.stock, stockData.productid]),
            (err, result) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, {
                        "msg": "success",
                        "stock": result.stock
                    });
                }
            }
        );
    }
};

productModel.deleteProduct = (productData, callback) => {
    if (connection) {
        connection.query(
            mysql.format(`DELETE FROM products WHERE productid = ?`, [productData.productid]),
            (err, result) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, {
                        "msg": "success"
                    });
                }
            }
        );
    }
};

function isValidVariable(str) {
    const validVariables = ['productname', 'stock'];
    return validVariables.includes(str);
}

module.exports = productModel;
