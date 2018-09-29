const mysql = require('mysql');

connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'clappspt'
});

let productModel = {};

productModel.searchProducts = (searchData, callback) => {
    console.log(searchData);
  if(connection){
    var q = "SELECT * FROM products ";

    //TODO: hacer mejor y tener en cuenta que puede haber SQL injection.
    if(searchData.name !== undefined && searchData.stock !== undefined){
      q += "WHERE productname LIKE \"%" + searchData.name + "%\" ";
      if(searchData.stock){
        q += "AND stock > 0 ";
      } else {
        q += "AND stock = 0 ";
      }
    } else if(searchData.name !== undefined){
        q += "WHERE productname LIKE \"%" + searchData.name + "%\" ";
    } else if(searchData.stock !== undefined){
        if(searchData.stock){
            q += "WHERE stock > 0 ";
        } else {
            q += "WHERE stock = 0 ";
        }
    }
    q += " ORDER BY productname";

    connection.query(
      // TODO: tener en cuenta que puede haber SQL injection.
      // `SELECT * FROM products WHERE UPPER(productname) ` +
      // `LIKE UPPER("%` + searchData.search + `%") ORDER BY productname`,
      q, (err, rows) => {
        if(err){
          callback(err, null);
        } else {
          callback(null, rows);
        }
      }
    );
  }
};

productModel.getProductsWithStock = (callback) => {
  if(connection){
    connection.query(
      // TODO: tener en cuenta que puede haber SQL injection.
      `SELECT * FROM products WHERE stock > 0 ORDER BY productname`,
      (err, rows) => {
        if(err){
          callback(err, null);
        } else {
          callback(null, rows);
        }
      }
    )
  }
};

productModel.insertProduct = (productData, callback) => {
  if(connection){
    if(productData.stock < 0){
      return callback(null, {
        "msg": "negative stock"
      });
    }

    connection.query(
      `SELECT * FROM products WHERE productname = ${connection.escape(productData.productname)}`,
      (err, row) => {
        if(row == null || row.length === 0){
          connection.query(
            "INSERT INTO products SET ?", productData,
            (err, result) => {
              if(err){
                callback(err, null);
              } else {
                callback(null, {
                  "msg"     : "success",
                  "insertId": result.insertId
                });
              }
            }
          );
        } else {
          callback(null, {
            "msg": "already exists"
          });
        }
      }
    )
  }
};

productModel.updateStock = (stockData, callback) => {
  if(connection){
    connection.query(
       `SELECT * FROM products WHERE productid = ${connection.escape(stockData.productid)}` ,
       (err, row) => {
         if(row != null && row.length == 1){
           var newStock = row[0].stock + stockData.stock <= 0 ? 0 : row[0].stock + stockData.stock;

           connection.query(
             `UPDATE products SET stock = ${newStock} ` +
             `WHERE productid = ${connection.escape(stockData.productid)}`,
             (err, result) => {
               if(err){
                 callback(err, null);
               } else {
                 callback(null, {
                   "msg"  : "success",
                   "stock": result.stock
                 });
               }
             }
           );
         } else {
           callback(null, {
             "msg": "fail"
           });
         }
       }
     )
  }
};

productModel.deleteProduct = (productData, callback) => {
  if(connection){
    connection.query(
      `DELETE FROM products WHERE productid = ${connection.escape(productData.productid)}`,
      (err, result) => {
        if(err){
          callback(err, null);
        } else {
          callback(null, {
            "msg"  : "success"
          });
        }
      }
    );
  }
};

module.exports = productModel;
