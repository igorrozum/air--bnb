const express = require("express")
const exphbs = require("express-handlebars")
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config({ path: "apis.env" })



const app = express();

app.engine("handlebars", exphbs())
app.set("view engine", "handlebars")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());



const generalRouter = require('./Routes/General')
const userSignUpRouter = require('./Routes/UserSignUp')
const userSignInRouter = require('./Routes/UserSignIn')
const listingsRouter = require('./Routes/Listings')
app.use('/', generalRouter)
app.use('/signUp', userSignUpRouter)
app.use('/signIn', userSignInRouter)
app.use('/listings', listingsRouter)

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