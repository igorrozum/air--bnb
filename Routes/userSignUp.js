const express = require('express')
const router = express.Router()
const User = require('../models/User') // For importing Database code





router.post('/', (req, res)=>{
    let valid = true;

    const email = {
        input : req.body.email,
        error : "",
        patt : /^[a-zA-Z0-9-_*.]{1,30}@[a-zA-Z0-9-_*.]{1,30}\.[a-zA-Z0-9]{1,10}$/
    }
    if (!email.patt.test(email.input)) {
        email.error = "Please enter correct email address";
        valid = false;
    } else {
        console.log(`1 - ${valid}`)
        // User.findOne({email: email.input})
        // .then((user) => {
        //     console.log(`2 - ${valid}`)
        //     if (user.email == email.input) {
        //         console.log(`3 - ${valid}`)
        //         email.error = "A user with this email address exists already"
        //         valid = false
        //         console.log(`4 - ${valid}`)
        //     }
        // })
        // .catch(err => console.log(`Something went wrong ${err}`))

        User.findOne({ email: email.input }, async function (err, user) {
            console.log(`2 - ${valid}`)
            if (user.email == email.input) {
                console.log(`3 - ${valid}`)
                email.error = "A user with this email address exists already"
                valid = false
                console.log(`4 - ${valid}`)
            }
        });

        console.log(`5 - ${valid}`)
    }



    console.log(`6 - ${valid}`)
    

    // const fname = {
    //     input : req.body.fname,
    //     error : "",
    //     patt : /^[a-zA-z]{2,20}$/
    // }
    // if (!fname.patt.test(fname.input)) {
    //     fname.error = "Please enter correct first name";
    //     valid = false;
    // }

    // let lname = {
    //     input : req.body.lname,
    //     error : "",
    //     patt : /^[a-zA-z]{2,20}$/
    // }
    // if (!lname.patt.test(lname.input)) {
    //     lname.error = "Please enter correct last name";
    //     valid = false;
    // }

    // let pass = {
    //     input : req.body.signUpPass,
    //     confPass: req.body.signUpPassConfirm,
    //     error : "",
    //     errorConfirm: "",
    //     patt : /^.{5,90}$/
    // }
    // if (!pass.patt.test(pass.input)) {
    //     pass.error = "Please enter stronger password";
    //     valid = false;
    // }

    // if (pass.input != pass.confPass) {
    //     pass.errorConfirm = "Passwords don't match"
    //     valid = false;
    // }

    // let date = {
    //     month : req.body.monthField,
    //     day : req.body.dayField,
    //     year : req.body.yearField,
    //     error : ""
    // }
    // if (!date.month || !date.day || !date.year) {
    //     date.error = "Please enter correct date";
    //     valid = false;
    // }


    const pagePath = req.header('referer').substr(req.header('referer').lastIndexOf("/")+1)
    let page = ""

    // await function()

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
            passConfirmError: pass.errorConfirm,
            dateError: date.error,
            signUpShowValue: "show",
            signUpblockValue: "block",
            bodyOpen: "modal-open",
            fadeValue: "modal-backdrop fade show",
            signUpariaValue: "true"
        })
    } else {
        console.log(`7 - ${valid}`)
        const formData = {
            email: req.body.email,
            fname: req.body.fname,
            lname: req.body.lname,
            password: req.body.signUpPass,
            dateOfBirth: new Date(req.body.yearField, req.body.monthField-1, req.body.dayField)
        }

        const user = new User(formData);
        user.save()
        .then(()=>{
            console.log(`The data was inserted into the document`)
            // const nodemailer = require('nodemailer');
            // const sgTransport = require('nodemailer-sendgrid-transport');
            // const options = {
            //     auth: {
            //         api_key: process.env.SENDGRID_API_KEY
            //     }
            // }
            // const mailer = nodemailer.createTransport(sgTransport(options));
    
            // const email = {
            //     to: req.body.email,
            //     from: 'farkop69@gmail.com',
            //     subject: 'Confirmation',
            //     text: `Thank you, ${req.body.fname} for the provided information. Your data has been saved successfully!`,
            //     html: `<p>Thank you, ${req.body.fname} for the provided information. Your data has been saved successfully!</p>`
            // };
             
            // mailer.sendMail(email, (err, res)=>{
            //     if (err) { 
            //         console.log(err) 
            //     }
            // })

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

module.exports = router