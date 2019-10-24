let signUpBut = document.querySelector("#SignUpBut");
let emailErrorDiv = document.querySelector("#emailError");


let form = document.querySelector("#signUpForm");

signUpBut.addEventListener("click", ()=>{
    let email = {
        input : document.querySelector("#signUpEmail").value,
        error : "Please enter correct email address",
        errorDiv : document.querySelector("#emailError"),
        patt : /^[a-zA-Z0-9-_*.]{1,30}@[a-zA-Z0-9-_*.]{1,30}\.[a-zA-Z0-9]{1,10}$/
    }

    let fname = {
        input : document.querySelector("#fname").value,
        error : "Please enter correct first name",
        errorDiv : document.querySelector("#fnameError"),
        patt : /^[a-zA-z]{2,20}$/
    }

    let lname = {
        input : document.querySelector("#lname").value,
        error : "Please enter correct last name",
        errorDiv : document.querySelector("#lnameError"),
        patt : /^[a-zA-z]{2,20}$/
    }

    let pass = {
        input : document.querySelector("#signUpPass").value,
        error : "Please enter stronger password",
        errorDiv : document.querySelector("#passError"),
        patt : /^.{5,90}$/
    }

    let date = {
        month : document.querySelector("#monthField").value,
        day : document.querySelector("#dayField").value,
        year : document.querySelector("#yearField").value,
        error : "Please enter correct date",
        errorDiv : document.querySelector("#dateError")
    }

    let valid = true;

    email.errorDiv.innerHTML = "";
    if (!email.patt.test(email.input)) {
        email.errorDiv.innerHTML = email.error;
        valid = false;
    }
    
    fname.errorDiv.innerHTML = "";
    if (!fname.patt.test(fname.input)) {
        fname.errorDiv.innerHTML = fname.error;
        valid = false;
    }
    
    lname.errorDiv.innerHTML = "";
    if (!lname.patt.test(lname.input)) {
        lname.errorDiv.innerHTML = lname.error;
        valid = false;
    }
    
    pass.errorDiv.innerHTML = "";
    if (!pass.patt.test(pass.input)) {
        pass.errorDiv.innerHTML = pass.error;
        valid = false;
    }

    date.errorDiv.innerHTML = "";
    if (!date.month || !date.day || !date.year) {
        date.errorDiv.innerHTML = date.error;
        valid = false;
    }
    
    if (valid) {
        form.setAttribute("action", "/signUp");
        form.setAttribute("method", "POST");
        form.submit();
    }
})



let signUpCloseBut = document.querySelector("#signUpClose")
let signInCloseBut = document.querySelector("#signInClose")
let confCloseBut = document.querySelector("#confClose")

signUpCloseBut.addEventListener('click', ()=>{
    let pagePath = ""
    let pageName = window.location.href.substr(window.location.href.lastIndexOf("/")+1)
    if (pageName == "signIn" || pageName == "signUp")
        pagePath = document.referrer.substr(document.referrer.lastIndexOf("/")+1)
    else
        pagePath = pageName

    let page = ""
    if (pagePath == "listings")
        page = "/listings"
    else
        page = "/"

    location.replace(page)
})

signInCloseBut.addEventListener('click', ()=>{
    let pagePath = ""
    let pageName = window.location.href.substr(window.location.href.lastIndexOf("/")+1)
    if (pageName == "signIn" || pageName == "signUp")
        pagePath = document.referrer.substr(document.referrer.lastIndexOf("/")+1)
    else
        pagePath = pageName


    let page = ""
    if (pagePath == "listings")
        page = "/listings"
    else
        page = "/"

    location.replace(page)
})

confCloseBut.addEventListener('click', ()=>{
    let pagePath = ""
    let pageName = window.location.href.substr(window.location.href.lastIndexOf("/")+1)
    if (pageName == "signIn" || pageName == "signUp")
        pagePath = document.referrer.substr(document.referrer.lastIndexOf("/")+1)
    else
        pagePath = pageName

    let page = ""
    if (pagePath == "listings")
        page = "/listings"
    else
        page = "/"

    location.replace(page)
})



// document.getElementsByClassName("close").addEventListener('click', ()=>{
//     location.replace("/")
// })