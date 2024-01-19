const db = require('../../config/db/index')
class ApiController{
    catergory(req, res){
        const query = 'select * from loai'
        db.query(query, (error, catergories) => {
            if(error){
                console.log(error)
            } 
            else {
                res.send(catergories)      
                }
        })
    }

    catergoryID(req, res){
        const {id} = req.params
        const query = "SELECT s.*, tp.matp, tp.name, n.anhnd, n.tennd, l.TENLOAI FROM sanpham s "
                    +" JOIN nguoidung n ON n.mand = s.mand "
                    +" JOIN xaphuongthitran xp ON xp.xaid = n.mapx "
                    +" JOIN quanhuyen qh ON qh.maqh = xp.maqh "
                    +" JOIN tinhthanhpho tp ON tp.matp = qh.matp "
                    +" JOIN loai l ON l.MALOAI = s.maloai"
                    +" Where xacnhan = 1 and s.maloai = ?"
        db.query(query,  id, (error, catergories) => {
            if(error){
                console.log("sever res same catID",error)
            } 
            else {
                res.send(catergories)      
                }
        })
    }

    ApiUsers(req, res){
        const query = 'Select * from nguoidung'
        db.query(query, (error, users) => {
            if(error){
                console.log(error)
            } else {
                res.send(users)
            }
        })
    }

    ApiAddUsers(req, res){
        const {userName,address,sdt,password,town} = req.body
        const query = 'Insert into nguoidung(tennd, sdt, diachi, matkhau, mapx) values(?,?,?,?,?)'

        db.query(query, [userName,sdt,address,password,town], (error, result) =>{
            if (error) {
                console.error('Lỗi khi insert nguoidung :', error);
              } else {
                console.log("insert nguoidung thanh cong")
                res.status(200).json({ success: true });
              }
        })
    }

    Apicities(req, res){
        const query = 'select * from tinhthanhpho'
        db.query(query, (error, cities) => {
            if(error){
                console.log(error)
            } 
            else {
                res.send(cities)      
                }
        })
    }

    ApiDistrictOfCity(req, res){
        const {id} = req.params
        if(id){
            const query = 'select * from quanhuyen where matp =' +id
            db.query(query, (error, districts) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    res.send(districts);
                }
            })
        } else console.log('get cityID failed')
    }

    ApiTownOfDistirct(req, res){
        const {id} = req.params
        if(id){
            const query = 'select * from xaphuongthitran where maqh = ?'
            db.query(query,[id], (error, xaphuong) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    res.status(200).json(xaphuong);
                }
            })
        } else console.log('get districtID failed')
    }

    ApiProducts(req, res){
        const query = 'SELECT s.*, tp.name, n.anhnd, n.tennd, l.TENLOAI FROM sanpham s '
        + ' JOIN nguoidung n ON n.mand = s.mand '
        + ' JOIN xaphuongthitran xp ON xp.xaid = n.mapx '
        + ' JOIN quanhuyen qh ON qh.maqh = xp.maqh '
        + ' JOIN tinhthanhpho tp ON tp.matp = qh.matp '
        + ' JOIN loai l ON l.MALOAI = s.maloai' 
        + ' Where xacnhan = 1'

        db.query(query, (error, users) => {
            if(error){
                console.log(error)
            } else {
                res.send(users)
            }
        })
    }

    ApiProductPost(req, res){
        const {id} = req.params
        const query = 'SELECT s.*, tp.name, n.anhnd, n.tennd, l.TENLOAI FROM sanpham s '
        + ' JOIN nguoidung n ON n.mand = s.mand '
        + ' JOIN xaphuongthitran xp ON xp.xaid = n.mapx '
        + ' JOIN quanhuyen qh ON qh.maqh = xp.maqh '
        + ' JOIN tinhthanhpho tp ON tp.matp = qh.matp '
        + ' JOIN loai l ON l.MALOAI = s.maloai' 
        + ' Where s.mand = ?'

        db.query(query, id, (error, users) => {
            if(error){
                console.log(error)
            } else {
                res.send(users)
            }
        })

    }

    ApiProductsSearch(req, res){
        const {search} = req.params.search
        const query = 'SELECT s.*, tp.name, n.anhnd, n.tennd, l.TENLOAI FROM sanpham s '
        + ' JOIN nguoidung n ON n.mand = s.mand '
        + ' JOIN xaphuongthitran xp ON xp.xaid = n.mapx '
        + ' JOIN quanhuyen qh ON qh.maqh = xp.maqh '
        + ' JOIN tinhthanhpho tp ON tp.matp = qh.matp '
        + ' JOIN loai l ON l.MALOAI = s.maloai' 
        + ' Where xacnhan = 1'
        db.query(query,(error, results) => {
            if(error){
                console.log(error)
            } else {
                res.send(results)
            }
        })
    }

    ApiProductStatus(req, res){
        const query = 'select * from trangthai'
        db.query(query, (error, status) => {
            if(error){
                console.log(error)
            } 
            else {
                res.send(status)      
                }
        })
    }


    ApiPost(req, res){
        const fileName = req.file.filename ? req.file.originalname : null 
        const {productData} = req.body
        const product = JSON.parse(productData)
        const {userID,selectStatus,catergory,productName, textDetails, price} = product

       const query = "INSERT INTO sanpham( tensp, anhsp, chitiet, gia, maloai, matt, mand, ngaydang)"
                     +" VALUES (?,?,?,?,?,?,?, NOW())"
        
       db.query(query, [productName, fileName, textDetails, price, catergory, selectStatus, userID], (error, result)=>{
        if(error){
            console.log("Lỗi khi thực hiện truy vấn SQL:", error);
            // res.status(500).json({ success: false, error: 'Lỗi khi thực hiện truy vấn SQL' });
        } else {
            res.json({ success: true});
        }
       })
    }


    ApiPostUpdate(req, res){
        const {productData} = req.body
        const product = JSON.parse(productData)
        const {productID,selectStatus,catergory,productName, textDetails, price} = product
        let query = '';
        let values = [];

        if (req.file) {
            const fileName = req.file.filename || null;
            query = `UPDATE sanpham
                    SET tensp = ?, anhsp = ?, chitiet = ?, gia = ?, maloai = ?, matt = ? 
                    WHERE masp = ?`;
            values = [productName, fileName, textDetails, price, catergory, selectStatus, productID];
        } else {
            query = `UPDATE sanpham
                    SET tensp = ?, chitiet = ?, gia = ?, maloai = ?, matt = ? 
                    WHERE masp = ?`;
            values = [productName, textDetails, price, catergory, selectStatus, productID];
        }

        // Sử dụng prepared statements để tránh SQL injection và tối ưu hiệu suất
        db.query(query, values, (error, result) => {
            if (error) {
                console.error('Lỗi khi update sanpham:', error);
                res.status(500).json({ success: false, error: 'Lỗi khi update sản phẩm' });
            } else {
                res.status(200).json({ success: true });
            }
        });
        
    }

    ApiDeletePost(req, res){
        const {id} = req.params
        const query = "Delete from sanpham where masp = ?"

        db.query(query, id, (error, rs) =>{
            if(error){
                console.error('delete sanpham failed')
                res.status(500).json({error: 'delete sanpham failed'})
            } else {
                console.log('delete sanpham successfully!!')
                res.status(200).json({ success: true});
            }
        })
    }

    ApiUserID(req, res){
        const {id} = req.params
        const query = 'Select n.*, tp.name as cityname, qh.name as dname from nguoidung n'
        + ' JOIN xaphuongthitran xp ON xp.xaid = n.mapx '
        + ' JOIN quanhuyen qh ON qh.maqh = xp.maqh '
        + ' JOIN tinhthanhpho tp ON tp.matp = qh.matp '                
        + ' where mand = ?'
        db.query(query, id, (error, users) => {
            if(error){
                console.log(error)
            } else {
                res.send(users)
            }
        })
    }

    ApiUsersFollowers(req, res){
        const query = "Select * from theodoi"
        db.query(query,(error, results) => {
            if(error){
                console.log(error)
            } else {
                res.send(results)
            }
        })
    }

    ApiUsersFollow(req, res){
        const { mand_theodoi, mand_duoctheodoi } = req.body;
        const query = "INSERT INTO `theodoi`(`mand_theodoi`, `mand_duoctheodoi`) VALUES (?,?)"
        db.query(query,[mand_theodoi, mand_duoctheodoi], (error, result)=>{
            if(error){
                console.error("insert theodoi failed!")
                res.status(500).json({error: 'delete sanpham failed'})
            }else {
                console.log('insert theodoi successfully!!')
                res.status(200).json({ success: true});
            }
        })
    }

    ApiUsersUnFollow(req, res){
        const {mand_theodoi, mand_duoctheodoi} = req.query
        const query = 'Delete from theodoi WHERE mand_theodoi =? and mand_duoctheodoi=?'
        db.query(query,[mand_theodoi, mand_duoctheodoi], (error, result)=>{
            if(error){
                console.error("delete theodoi failed!")
                res.status(500).json({error: 'delete sanpham failed'})
            }else {
                console.log('delete theodoi successfully!!')
                res.status(200).json({ success: true});
            }
        })
    }

    ApiUsersFollowerInfo(req, res){
        const {id} = req.params
        const query = "SELECT u.mand, u.tennd, u.anhnd "
                     +" FROM theodoi td"
                     +" JOIN nguoidung u ON td.mand_duoctheodoi = u.mand"
                     +" WHERE td.mand_theodoi = ?"
        db.query(query, id,(error, results) => {
            if(error){
                console.log(error)
            } else {
                res.send(results)
            }
        })
    }

    ApiUsersSubcriber(req, res){
        const {id} = req.params
        const query = "SELECT u.mand, u.tennd, u.anhnd "
                     +" FROM theodoi td"
                     +" JOIN nguoidung u ON td.mand_theodoi = u.mand"
                     +" WHERE td.mand_duoctheodoi = ?"
        db.query(query, id,(error, results) => {
            if(error){
                console.log(error)
            } else {
                res.send(results)
            }
        })
    }

    AipSameProduts(req, res){
        const {idLoai , idUser} = req.params
        const query = 'SELECT s.*, tp.name, n.anhnd, n.tennd, l.TENLOAI FROM sanpham s '
        + ' JOIN nguoidung n ON n.mand = s.mand '
        + ' JOIN xaphuongthitran xp ON xp.xaid = n.mapx '
        + ' JOIN quanhuyen qh ON qh.maqh = xp.maqh '
        + ' JOIN tinhthanhpho tp ON tp.matp = qh.matp '
        + ' JOIN loai l ON l.MALOAI = s.maloai' 
        + ' Where xacnhan = 1 AND s.maloai = ? AND s.mand <> ?'
        db.query(query, [idLoai, idUser],(error, results) => {
            if(error){
                console.log(error)
            } else {
                res.send(results)
            }
        })
    }


    CreateGroupchat(req, res){
        const {gui, nhan, masp} = req.params
        const query = 'Select * from groupchat Where mand_gui = ? AND mand_nhan = ? AND masp =?'
        const createGrchat = 'Insert into groupchat(mand_gui, mand_nhan, masp) values(?,?,?)'
        db.query(query, [gui, nhan, masp], (error, result) => {
            if(error){
                console.log("select group err: ", error)
            } else {
                if(result.length === 0){
                    db.query(createGrchat, [gui, nhan, masp], (cErrro, cResult)=>{
                        if(cErrro){
                            console.log(cErrro)
                        } else {
                            const magroup = cResult.insertId; 
                            res.status(200).json({ magroup });
                        }
                    })
                } else {
                    res.send(...result)
                }
            }
        })

    }


    AddMessage(req, res){
        const {magroup, userLogin, text, trangthai} = req.body
        const query = 'Insert into tinnhan(magroup, mand_gui, thoigiangui, noidung, trangthai)' 
                     +' values(?,?,NOW(),?,?)'
        db.query(query, [magroup, userLogin, text, trangthai], (error, result)=>{
            if(error){
                console.log("ERROR insert tinnhan: ", error)
            } else {
                console.log("messages sended success!!")
                res.status(200).json({ success: true });
            }
        })
    }

    GetMessagesGroup(req, res){
        const {IdGroup} = req.params
        const query = 'SELECT * FROM tinnhan WHERE magroup = ? GROUP BY matinnhan'

        db.query(query, IdGroup, (error, result)=>{
            if(error){
                console.log(error)
            } else {
                res.send(result)
            }
        })
    }

    GetGroupchat(req, res){
        const {userId} = req.params
        const query = 'Select * from groupchat where mand_gui=? or mand_nhan=?'
    
        
        db.query(query, [userId,userId], (error, result)=>{
            if(error){
                console.log(error)
            } else {
              res.send(result)
            }
        })
    }

    
    productUserGroupInfo(req, res){
        const {userId} = req.params
        const userInfo = 'SELECT  n.mand, n.anhnd, n.tennd, s.masp, s.tensp, s.anhsp FROM sanpham s'
                      +' JOIN nguoidung n ON n.mand = s.mand '
                      +'  WHERE s.masp =?'

        db.query(userInfo, userId, (error, result)=>{
        if(error){
            console.log(error)
        } else {
          res.send(result)
        }
    })

    }

    DeleteGroup(req, res){
        const {magroup} =  req.params
        const deleteTinnhan = 'Delete from tinnhan Where magroup = ?'
        const deleteGroup = 'Delete from groupchat Where magroup = ?'
        // console.log("magroup " + magroup)
        db.query(deleteTinnhan, magroup, (error, rs) =>{
            if(error){
                console.log(error)
            } else {
                db.query(deleteGroup, magroup, (error, rs) =>{
                    if(error){
                        console.log(error)
                    } else {
                        res.status(200).json({ success: true });
                    }
                })
            }
        })
    }



    AddEvaluateMessage(req, res){
        const { userLogin, text} = req.body
        const query = 'Insert into binhluandanhgia(mand_bl, noidung, thoigiantao)' 
                     +' values(?,?,NOW())'
        db.query(query, [userLogin, text], (error, result)=>{
            if(error){
                console.log("ERROR insert binhluandanhgia: ", error)
            } else {
                console.log("binhluandanhgia sended success!!")
                res.status(200).json({ success: true });
            }
        })
    }
    
}




module.exports = new ApiController