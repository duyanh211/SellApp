const productsController = require('../app/controllers/ProductsController')
const express = require('express')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'src/public/imgs/')
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname)
    }
})
const upload = multer({storage: storage})

router.use('/catergory/edit/:id', productsController.setEditCatergory)
router.delete('/catergory/delete/:id', productsController.deleteCatergory)
router.put('/catergory/update', upload.single('putCatImage'), productsController.updateCatergory)
router.post('/catergory/add', upload.single('catImage'), productsController.addCatergory)
router.use('/catergory', productsController.indexCatergory)



module.exports = router

