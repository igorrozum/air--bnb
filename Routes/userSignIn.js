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


module.exports = router