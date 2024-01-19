const usercontroller = require('../app/controllers/UserController')
const express = require('express')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'src/public/imgs/')
    },
    filename: (req, file, cb) =>{
        console.log(file)
        cb(null, file.originalname)
    }
})
const upload = multer({storage: storage})

router.use('/list/details/:id', usercontroller.userDetailsPage)
router.get('/list/:search', usercontroller.userListSearch)
router.use('/list', usercontroller.indexUserList)

// products Post
router.get('/productsPost/checkStatusTrue/:idtin', usercontroller.updateUserPostTrue)
router.get('/productsPost/checkStatusFalse/:idtin', usercontroller.updateUserPostFalse)
router.get('/productsPost/check/:id', usercontroller.productsPostCheck)
router.get('/productsPost/:search', usercontroller.productsPostSearch)
router.use('/productsPost', usercontroller.indexProductsPost)


// user comments to user
router.use('/comments', usercontroller.indexCommentsPost)

// feedbacks from user
router.use('/feedbacks', usercontroller.indexFeedback)

module.exports = router
