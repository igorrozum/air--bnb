const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


const Schema = mongoose.Schema;


const userSchema = new Schema({
    email: {type: String, required: true},
    fname: {type: String, required: true},
    lname: {type: String, required: true},
    password: {type: String, required: true},
    admin: {type: Boolean, default: false},
    dateOfBirth: {type: Date, required: true},
    bookedRooms : [mongoose.Types.ObjectId]

})


userSchema.pre('save', function(next){
    bcrypt.genSalt(10)
    .then(salt => {
        bcrypt.hash(this.password, salt)
        .then(hash => {
            this.password = hash;
            next()
        })
    })
    .catch(err => console.log(`Something went wrong: ${err}`))
})


const userModel = mongoose.model('Users', userSchema);

module.exports = userModel;