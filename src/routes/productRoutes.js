const url = require('url');
const ProductController = require('../controllers/productController');

module.exports = function (app) {

    app.get('/products', ProductController.searchProducts);

    app.post('/products', ProductController.newProduct);

    app.delete('/products/:id', ProductController.deleteProduct);

    app.put('/products/:id', ProductController.updateStock);

};
