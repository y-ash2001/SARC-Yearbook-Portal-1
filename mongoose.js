const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/sarc-portal', {
        useNewUrlParser : true,
        useCreateIndex : true,
})

const User = mongoose.model('User', {
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

module.exports = User;

