const mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
    name : {
        type : String
    },
    imageUrl : {
        type : String
    },
    email : {

    },
    bitsId : {

    },
    nominatedby : {
        type : Array
    },
    quote: {

    },
    discipline : {

    },
    captions : {
        type : Array
    }
    })
var User = mongoose.model('User', UserSchema);
module.exports = User;
