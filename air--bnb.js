const express = require("express")
const exphbs = require("express-handlebars")
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config({ path: "apis.env" })
const session = require('express-session')



const app = express();

app.engine("handlebars", exphbs())
app.set("view engine", "handlebars")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({secret: "This is my secret key",
        resave: false,
        saveUninitialized: false}))
app.use((req, res, next) => {
    //This is a global variable that can be accessed by templates
    res.locals.user = req.session.userInfo
    next()
})



const generalRouter = require('./Routes/General')
const userSignUpRouter = require('./Routes/userSignUp')
const userSignInRouter = require('./Routes/userSignIn')
const listingsRouter = require('./Routes/Listings')
const dashboardRouter = require('./Routes/Dashboard')
const searchRouter = require('./Routes/Search')
const roomRouter = require('./Routes/Room')
app.use('/', generalRouter)
app.use('/signUp', userSignUpRouter)
app.use('/signIn', userSignInRouter)
app.use('/listings', listingsRouter)
app.use('/dashboard', dashboardRouter)
app.use('/searchRooms', searchRouter)
app.use('/room', roomRouter)

app.use('/', (req, res) => {
    res.render("404")
})


// Database connection
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log(`App is connected to the database`))
.catch(err => console.log(`Something went wrong: ${err}`))




app.listen(process.env.PORT, ()=>{
    console.log(`The connection is set to port ${process.env.PORT}`);
})