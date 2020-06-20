const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const keys = require('./keys')
const User = require('../mongoose')
const { deserializeUser } = require('passport')

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user)
    })
})

passport.use(new GoogleStrategy({
    callbackURL : '/auth/google/redirect',
    clientID : keys.google.clientID,
    clientSecret : keys.google.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({email : profile.emails[0].value}).then((currentUser) => {
        if(currentUser) {
            done(null, currentUser)
        }
        else {
            let user = new User({
                name : profile.displayName,
                imageUrl : profile.photos[0].value,
                email : profile.emails[0].value
              })
            user.save().then((newUser) => {
                done(null, newUser)
            })
        }
    })
}))