const manageProductsRouter = require('./products')
const userRoute = require('./user')
const appRoute = require('./appApi')
const home = require('./home')


function route(app){
app.use('/products', manageProductsRouter)
app.use('/users', userRoute)
app.use('/app',appRoute)
}

module.exports = route


