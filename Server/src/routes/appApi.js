const ApiController = require('../app/controllers/ApiController')
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

router.delete('/delete/:id', ApiController.ApiDeletePost)
router.put('/update',upload.single('editImage'), ApiController.ApiPostUpdate)
router.post('/post',upload.single('image'), ApiController.ApiPost)
router.get('/product/:id', ApiController.ApiProductPost)
router.get('/products/:search', ApiController.ApiProductsSearch)
router.get('/products', ApiController.ApiProducts)

router.get('/status', ApiController.ApiProductStatus)

router.get('/catergories/:id', ApiController.catergoryID)
router.get('/catergories', ApiController.catergory)

router.delete('/users/unFollows', ApiController.ApiUsersUnFollow)
//lấy từ bảng theo dõi
router.get('/users/followers', ApiController.ApiUsersFollowers)
router.post('/users/follows', ApiController.ApiUsersFollow)
//join thêm bảng nguoidung
router.get('/users/followerOf/:id', ApiController.ApiUsersFollowerInfo)
router.get('/users/subcribers/:id', ApiController.ApiUsersSubcriber)

router.post('/users/add', ApiController.ApiAddUsers)
router.get('/users/:id', ApiController.ApiUserID)
router.get('/users', ApiController.ApiUsers)

router.get('/cities/district/:id', ApiController.ApiTownOfDistirct)
router.get('/cities/:id', ApiController.ApiDistrictOfCity)
router.get('/cities', ApiController.Apicities)

// api tìm theo danh  mục nên tìm bằng id => cần 1 api           1

// lọc theo giá  cao tới thấp ngược lại 2 api                   1

// lọc theo tỉnh/tp tìm theo sử dụng ApiUserID->tp/qh 1 api      1


router.get('/sameProducts/:idLoai/:idUser', ApiController.AipSameProduts)

// nhắn tin 3 api (crud)                                        1
router.get('/chat/:gui/:nhan/:masp', ApiController.CreateGroupchat)
router.post('/chat/addMessage', ApiController.AddMessage)
router.get('/chat/getMes/:IdGroup', ApiController.GetMessagesGroup)
router.get('/chat/groupchats/:userId', ApiController.GetGroupchat)
router.get('/chat/groupInfo/:userId', ApiController.productUserGroupInfo)
router.delete('/chat/delete/:magroup', ApiController.DeleteGroup)



// trợ giúp (chatbot)                                           1

// Đóng góp ý kiến 1 api (cr)                                   1
router.post('/evaluate/addMessage', ApiController.AddEvaluateMessage) 

// đánh giá 3 api (crud)                                        2

// cài đặt tk 1api (u)                                          2    



module.exports = router
