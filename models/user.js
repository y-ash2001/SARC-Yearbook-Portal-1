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

    },
    quote: {

    }
})

module.exports = User;