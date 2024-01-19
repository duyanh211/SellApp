const mysql = require('mysql')

const connect = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 's2h_db'
    })
    



module.exports = connect