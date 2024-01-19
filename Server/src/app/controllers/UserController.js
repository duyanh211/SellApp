const { query } = require('express')
const db = require('../../config/db/index')
const moment = require('moment')
moment().format("MMM Do YY"); 

class Usercontroller{
    indexUserList(req, res){
        const query = "SELECT u.*, p.name as xaphuong, d.name as quanhuyen, c.name as thanhpho "
                       + " FROM nguoidung u "
                       + " JOIN xaphuongthitran p ON u.mapx = p.xaid "
                       + " JOIN quanhuyen d ON p.maqh = d.maqh "
                       + " JOIN tinhthanhpho c ON d.matp = c.matp "
        db.query(query, (error, users) => {
            if(error){
                console.log(error)
            } 
            else {
                res.render('UserList', {usersList: true, users})
                }
        })
        
    }

    userDetailsPage(req, res){
        const id = req.params.id
        const query = "SELECT u.*, p.name as xaphuong, d.name as quanhuyen, c.name as thanhpho "
                       + " FROM nguoidung u "
                       + " JOIN xaphuongthitran p ON u.mapx = p.xaid "
                       + " JOIN quanhuyen d ON p.maqh = d.maqh "
                       + " JOIN tinhthanhpho c ON d.matp = c.matp "
                       + "Where mand = ?"

        db.query(query,id, (error, user)=>{
            if(error){
                console.error("Select * for userDetails "+ error)
                res.status(500).json({ error: 'Select * for userDetails' })
            } else {
                res.render('UserDetails' , {user})
            }
        })
    }


    userListSearch(req, res){
        const searchData = req.params.search;
        const query = "SELECT u.*, p.name as xaphuong, d.name as quanhuyen, c.name as thanhpho "
                        + " FROM nguoidung u "
                        + " JOIN xaphuongthitran p ON u.mapx = p.xaid "
                        + " JOIN quanhuyen d ON p.maqh = d.maqh "
                        + " JOIN tinhthanhpho c ON d.matp = c.matp "
                        + "WHERE u.tennd like ? or p.name like ? or c.name LIKE ? or u.diachi like ?  or u.sdt like ?"

        const searchValue = `%${searchData}%`;
        db.query(query, [searchValue, searchValue, searchValue, searchValue, searchValue], (error, searchResults) => {
            if(error){
                console.error("select for search err " + error)
                res.status(500).json({error: "select for search err"})
            } else {
                res.status(200).json(searchResults);
            }
        })

    }

    
    // manage comments
    indexCommentsPost(req, res){
        const query = `SELECT bl.*, DATE_FORMAT(thoigiantao, '%H:%i %d/%m/%y') as DateCreate, tennd, anhnd FROM binhluandanhgia bl
                        JOIN nguoidung nd on bl.mand_bl = nd.mand`

        db.query(query, (error, rs)=>{
            if (error) {
                console.error("Select * from binhluandanhgia: " + error);
                res.status(500).json({ error: "Select * from binhluandanhgia" });
            } else {
                res.render('PostComments', {PostComments: rs}) 
            }
        })
       
    }

    queryHandle(query) {
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    indexProductsPost = async (req, res) =>{
        const query = 'SELECT n.sdt, s.tensp, s.anhsp, s.gia, s.ngaydang, s.masp, s.xacnhan from nguoidung n ' +
                        ' JOIN sanpham s ON n.mand = s.mand ' 
        try {
            const postDefault = await this.queryHandle(query)
            postDefault.forEach(post => {
                post.ngaydang = moment(post.ngaydang).locale('vi').format("ddd D/M/YY");
                if(!post.xacnhan){
                    post.xacnhan = "Chờ duyệt" 
                    post.check = false
                } else {
                    post.xacnhan = "Đã duyệt"
                    post.check = true
                }
            });

            res.render('ProductsPost', {ProductsPost: true, posts: postDefault})
        } catch (err){
            console.error('Lỗi trong quá trình truy vấn queryHandle:', err);
        } 
    }

    updateUserPostTrue(req, res){
        const masp = req.params.idtin;
        const tinhtrang = 1
        const updateQuery = `UPDATE sanpham SET xacnhan = ? WHERE masp = ?`;
    
        db.query(updateQuery,[tinhtrang, masp],  (error, results) => {
            if (error) {
                console.error("Update dangtin tt to true error: " + error);
                res.status(500).json({ error: "Update dangtin error" });
            } else {
                res.status(200).json({ success: true });
            }
        });
    }

    updateUserPostFalse(req, res){
        const matin = req.params.idtin;
        const tinhtrang = 0
        const updateQuery = `UPDATE sanpham SET xacnhan = ? WHERE masp = ?`;
    
        db.query(updateQuery,[tinhtrang, matin],  (error, results) => {
            if (error) {
                console.error("Update dangtin tt to false error: " + error);
                res.status(500).json({ error: "Update dangtin error" });
            } else {
                res.status(200).json({ success: true });
            }
        });
    }

    productsPostSearch(req, res){
        const searchData = req.params.search;
        const query = 'SELECT n.sdt, s.tensp, s.anhsp, s.gia, s.ngaydang, s.masp, s.xacnhan from nguoidung n ' +
                        ' JOIN sanpham s ON s.mand = n.mand ' +
                        ' Where n.sdt like ? or s.tensp like ? or s.gia like ? or s.masp like ? or Day(s.ngaydang) = ? '

        const searchValue = `%${searchData}%`;
        db.query(query , [searchValue, searchValue, searchValue, searchValue, searchValue], (error, searchResults) => {
            if(error){
                console.error("select for search err " + error)
                res.status(500).json({error: "select for search err"})
            } else {
                res.status(200).json(searchResults);
            }
        })
    }

    productsPostCheck(req, res){
        const {id} = req.params;
        const query = 'SELECT n.sdt, s.tensp, s.anhsp, s.gia, s.ngaydang, s.masp, s.xacnhan from nguoidung n ' +
                        ' JOIN sanpham s ON s.mand = n.mand ' +
                        ' Where s.xacnhan = ? '

        db.query(query , id, (error, searchResults) => {
            if(error){
                console.error("select for search err " + error)
                res.status(500).json({error: "select for search err"})
            } else {
                res.status(200).json(searchResults);
            }
        })
    }

    indexFeedback(req, res){
        res.render('Feedbacks', {exitsFeedback: true})
    }
}

module.exports = new Usercontroller