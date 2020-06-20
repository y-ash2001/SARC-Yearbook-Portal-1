const router = require('express').Router()
const passport = require('passport')
const passportSetup = require('../config/passport-setup')
// auth login
router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})
 
router.get('/google', passport.authenticate('google', {
    scope : ['profile', 'email']
}))

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile/' + req.user.id)
})
module.exports = router