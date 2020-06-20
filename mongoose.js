const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/sarc-portal', {
        useNewUrlParser : true,
        useCreateIndex : true,
        useUnifiedTopology : true
})
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

