const mongoose = require('mongoose')

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