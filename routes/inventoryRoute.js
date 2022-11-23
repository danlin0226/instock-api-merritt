const router = require('express').Router()
const inventoryController = require('../controllers/inventoryController')

router.route('/').get(inventroyController.index)
moduel.exports = router
