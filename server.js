const express = require('express');
var bodyParser = require('body-parser');
const User = require('./mongoose')
const app = express();
const passport = require('passport')
const keys = require('./config/keys')
const cookieSession = require('cookie-session')
const port = 3000;

app.use(cookieSession({
  maxAge : 24 * 60 * 60 * 1000,
  keys : [keys.session.cookieKey]
}))

app.use(passport.initialize())
app.use(passport.session())


app.use(express.static('public'));
app.listen(port, () => console.log('Listening at port ' + port));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const authRoutes = require('./routes/auth-routes')
const getRoutes = require('./routes/get-routes')
const postRoutes = require('./routes/post-routes')
app.use('/auth', authRoutes)
app.use('/', getRoutes)
app.use('/', postRoutes)

