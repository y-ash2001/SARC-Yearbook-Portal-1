const nodemailer = require('nodemailer')
const keys = require('./keys')

transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : keys.email.user,
        pass : keys.email.password
    }
})

module.exports = transporter