const url = require('url');

const IndexController = require('../controllers/index');

module.exports = function (app) {

    app.get('/', IndexController.index);

}
