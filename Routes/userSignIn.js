const express = require('express')
const router = express.Router()
const User = require('../Models/User') // For importing Database code
// const session = require('express-session')
const bcrypt = require('bcryptjs')



router.get('/', (req, res)=>{
    res.redirect('/listings')
})

router.post('/', (req, res)=>{
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

    const pagePath = req.header('referer').substr(req.header('referer').lastIndexOf("/")+1)
    let page, route = ""
    if (pagePath == "listings") {
        page = "listings"
        route = "/listings"
    } else {
        page = "index"
        route = "/"
    }


    if(!valid)
    {
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
        User.findOne({ email: email.input })
        .then(user => {
            if (user) {
                bcrypt.compare(pass.input, user.password)
                .then(isMatched => {
                    if (isMatched) {
                        // Create session
                        req.session.userInfo = user
                        res.redirect('/dashboard')
                    } else {
                        res.render(page, {
                            passError: "Your password doesn't match",
                            signInShowValue: "show",
                            signInblockValue: "block",
                            bodyOpen: "modal-open",
                            fadeValue: "modal-backdrop fade show",
                            signInariaValue: "true"
                        })
                        
                    }
                })
                .catch(err => console.log(`Something went wrong: ${err}`))
            } else {
                res.render(page, {
                    emailError: "Your email wasn't found",
                    signInShowValue: "show",
                    signInblockValue: "block",
                    bodyOpen: "modal-open",
                    fadeValue: "modal-backdrop fade show",
                    signInariaValue: "true"
                })
            }
        })

    }    
})


router.get('/logout', (req, res)=>{
    const pagePath = req.header('referer').substr(req.header('referer').lastIndexOf("/")+1)
    let route = ""
    if (pagePath == "listings") {
        route = "/listings"
    } else {
        route = "/"
    }

    req.session.destroy()
    res.redirect(route)
})

module.exports = router