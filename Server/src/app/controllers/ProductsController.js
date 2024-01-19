const db = require('../../config/db/index')
class ProductsController{
    indexCatergory(req, res){
        const query = 'select * from loai'
        db.query(query, (error, catergories) => {
            if(error){
                console.log(error)
            } 
            else {
                res.render('Catergory', {catergories, catergory: true})      
                }
        })
    }

    addCatergory(req, res){
        const {catName} = req.body
        const image = req.file.filename ? req.file.originalname : null 
        const query = "Insert into loai(TENLOAI, ANHLOAI) values(?, ?)"
        db.query(query, [catName, image], (error, resp)=>{
            if(error){
                console.error("Insert catergoty err: "+ error)
                res.status(500).json({ error: 'Lỗi khi chèn catergoty vào cơ sở dữ liệu.' })
            }else {
                console.log('Data catergoty inserted successfully');
                    res.redirect('../catergory');
            }
        })
    }

    setEditCatergory(req, res){
        const id = req.params.id
        const query = "Select * from loai Where MALOAI = ?"

        db.query(query, id, (error, catergory)=>{
            if(error){
                console.error("Select * form loai Where MALOAI : "+ error)
                res.status(500).json({ error: 'Select * form loai Where MALOAI.' })
            }else {
                    res.render('CatergoryEdit', {catergory});
            }
        })
    }

    updateCatergory(req, res){
        const image = req.file ? req.file.filename : null;
        const {ucatName, id} = req.body
    
        if(image && ucatName){
            const query = 'update loai set TENLOAI = ?, ANHLOAI = ? where MALOAI = ?'
            db.query(query, [ucatName, image, id], (error, result) => {
              if (error) {
                console.error('Lỗi khi update loai:', error);
              } else {
                res.status(200).json({ success: true });
              }
            });
        } else if(!image){
            const query = 'update loai set TENLOAI = ? where MALOAI = ?'
            db.query(query, [ucatName, id], (error, result) => {
              if (error) {
                console.error('Lỗi khi update:', error);
              } else {
                console.log('Data update dont change img');
                res.status(200).json({ success: true });
              }
            });
        } 
    }

    deleteCatergory(req, res){
        const maloai = req.params.id
        const query = "Delete from loai where MALOAI = ?"

        db.query(query, maloai, (error, rs) =>{
            if(error){
                console.error('delete loai failed')
                res.status(500).json({error: 'delete nuoc failed'})
            } else {
                console.log('delete loai successfully!!')
                res.status(200).json({ success: true , result: rs});
            }
        })
    }



 
    
}

module.exports = new ProductsController