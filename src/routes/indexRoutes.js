const url = require('url');

const IndexController = require('../controllers/indexController');

module.exports = function (app) {

    app.get('/', IndexController.index);

}
