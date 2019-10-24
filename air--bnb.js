const express = require("express")
const exphbs = require("express-handlebars")
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const path = require('path')
require('dotenv').config({ path: "apis.env" })


const app = express();

app.engine("handlebars", exphbs())
app.set("view engine", "handlebars")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());



// Database connection
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log(`App is connected to the database`);
})
.catch((err)=>{
    console.log(`Something went wrong: ${err}`);
})

const Schema = mongoose.Schema
const AirBnbSchema = new Schema({
    email: {type: String, required: true},
    fname: {type: String, required: true},
    lname: {type: String, required: true},
    password: {type: String, required: true},
    dateOfBirth: {type: Date, required: true}
})
const Users = mongoose.model('Users', AirBnbSchema);



app.get("/", (req, res)=>{
    res.render("index", {
        title : "Home | AirBnb"
    });
});


app.get("/listings", (req, res)=>{
    res.render("listings", {
        title : "Room Listings - Airbnb"
    });
});




app.post("/", (req, res)=>{
    let checkinError = "";
    let checkoutError = "";
    let datesError = "";
    const curDate = new Date().setHours(0, 0, 0, 0);
    const checkinDate = new Date(req.body.checkinDate);
    const checkoutDate = new Date(req.body.checkoutDate);

    if (req.body.checkinDate == "" || checkinDate.toString() == "Invalid Date")
        checkinError = "Enter correct Check-in date";
    else if (checkinDate < curDate)
        checkinError = "Date can't be lower than today";

    if (req.body.checkoutDate == "" || checkoutDate.toString() == "Invalid Date")
        checkoutError = "Enter correct Check-out date";
    else if (checkoutDate < curDate)
        checkoutError = "Date can't be lower than today";

    if (checkinDate > checkoutDate)
        datesError = "Check-out date can't be before check-in date"

    if (checkinError || checkoutError || datesError) {
        res.render("index", {
            checkinError : checkinError,
            checkoutError : checkoutError,
            datesError : datesError
        })
    } else {
        res.redirect("/");
    }

})



app.post('/signUp', (req, res)=>{
    let valid = true;

    const email = {
        input : req.body.email,
        error : "",
        patt : /^[a-zA-Z0-9-_*.]{1,30}@[a-zA-Z0-9-_*.]{1,30}\.[a-zA-Z0-9]{1,10}$/
    }
    if (!email.patt.test(email.input)) {
        email.error = "Please enter correct email address";
        valid = false;
    }

    const fname = {
        input : req.body.fname,
        error : "",
        patt : /^[a-zA-z]{2,20}$/
    }
    if (!fname.patt.test(fname.input)) {
        fname.error = "Please enter correct first name";
        valid = false;
    }

    let lname = {
        input : req.body.lname,
        error : "",
        patt : /^[a-zA-z]{2,20}$/
    }
    if (!lname.patt.test(lname.input)) {
        lname.error = "Please enter correct last name";
        valid = false;
    }

    let pass = {
        input : req.body.signUpPass,
        error : "",
        patt : /^.{5,90}$/
    }
    if (!pass.patt.test(pass.input)) {
        pass.error = "Please enter stronger password";
        valid = false;
    }

    let date = {
        month : req.body.monthField,
        day : req.body.dayField,
        year : req.body.yearField,
        error : ""
    }
    if (!date.month || !date.day || !date.year) {
        date.error = "Please enter correct date";
        valid = false;
    }


    const pagePath = req.header('referer').substr(req.header('referer').lastIndexOf("/")+1)
    let page = ""

    if(!valid)
    {
        if (pagePath == "listings")
            page = "listings"
        else
            page = "index"
        res.render(page, {
            emailError: email.error,
            fnameError: fname.error,
            lnameError: lname.error,
            passError: pass.error,
            dateError: date.error,
            signUpShowValue: "show",
            signUpblockValue: "block",
            bodyOpen: "modal-open",
            fadeValue: "modal-backdrop fade show",
            signUpariaValue: "true"
        })
    } else {
        const formData = {
            email: req.body.email,
            fname: req.body.fname,
            lname: req.body.lname,
            password: req.body.signUpPass,
            dateOfBirth: new Date(req.body.yearField, req.body.monthField-1, req.body.dayField)
        }

        const user = new Users(formData);
        user.save()
        .then(()=>{
            console.log(`The data was inserted into the document`)
            const nodemailer = require('nodemailer');
            const sgTransport = require('nodemailer-sendgrid-transport');
            const options = {
                auth: {
                    api_key: process.env.SENDGRID_API_KEY
                }
            }
            const mailer = nodemailer.createTransport(sgTransport(options));
    
            const email = {
                to: req.body.email,
                from: 'farkop69@gmail.com',
                subject: 'Confirmation',
                text: `Thank you, ${req.body.fname} for the provided information. Your data has been saved successfully!`,
                html: `<p>Thank you, ${req.body.fname} for the provided information. Your data has been saved successfully!</p>`
            };
             
            mailer.sendMail(email, (err, res)=>{
                if (err) { 
                    console.log(err) 
                }
            })

            if (pagePath == "listings")
                page = "listings"
            else
                page = "index"
            res.render(page, {
                confShowValue: "show",
                confblockValue: "block",
                bodyOpen: "modal-open",
                fadeValue: "modal-backdrop fade show",
                confariaValue: "true"
            }) 

        })
        .catch ((err)=>{
            console.log(`Data wasn't inserted to the database: ${err}`)
        })




        
    }
})



app.post('/signIn', (req, res)=>{
    let valid = true;
    

    const email = {
        input : req.body.email,
        error : "",
        patt : /^[a-zA-Z0-9-_*.]{1,30}@[a-zA-Z0-9-_*.]{1,30}\.[a-zA-Z0-9]{1,10}$/
    }
    if (!email.patt.test(email.input)) {
        email.error = "Email address is invalid";
        valid = false;
    }
 
    let pass = {
        input : req.body.signInPass,
        error : "",
        patt : /^.{5,90}$/
    }
    if (!pass.patt.test(pass.input)) {
        pass.error = "Password is too short";
        valid = false;
    }


    if(!valid)
    {
        
        const pagePath = req.header('referer').substr(req.header('referer').lastIndexOf("/")+1)
        let page = ""
        if (pagePath == "listings")
            page = "listings"
        else
            page = "index"
        res.render(page, {
            emailError: email.error,
            passError: pass.error,
            signInShowValue: "show",
            signInblockValue: "block",
            bodyOpen: "modal-open",
            fadeValue: "modal-backdrop fade show",
            signInariaValue: "true"
        })
    } else {
        res.redirect("/");

    }    
})



app.listen(process.env.PORT, ()=>{
    console.log(`The connection is set to port ${process.env.PORT}`);
})