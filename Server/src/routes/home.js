const express = require('express')
const router = express.Router()
const HomeController = require('../app/controllers/HomeController')


router.post('/city/:id', HomeController.getDistricts)
router.get('/district/:id', HomeController.getPx)
router.use('/', HomeController.index)

module.exports = router