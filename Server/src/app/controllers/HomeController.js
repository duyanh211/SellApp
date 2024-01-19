const db = require('../../config/db/index')
class HomeController{
    index(req, res){
        const query = 'select * from tinhthanhpho'
        db.query(query, (error, cities) => {
            if(error){
                console.log(error)
            } 
            else {
                res.render('home', {cities})      
                }
        })
    }

    getDistricts(req, res){
        const {id} = req.params
        if(id){
            const query = 'select * from quanhuyen where matp =' +id
            db.query(query, (error, districts) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    res.status(200).json(districts);
                }
            })
        } else console.log('get cityID failed')
    }


    getPx(req, res){
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
}

module.exports = new HomeController