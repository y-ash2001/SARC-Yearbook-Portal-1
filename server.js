const express = require('express');
var bodyParser = require('body-parser');
require('./db/mongoose')
const User = require('./models/user')
const app = express();
const passport = require('passport')
const keys = require('./config/keys')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const cookieSession = require('cookie-session')
const port = 3000;

app.use(cookieParser())
app.use(cookieSession(({
  secret : keys.session.cookieKey,
  cookie : {maxAge : 60000},
  resave : false,
  saveUninitialized : false
})))
app.use(flash())

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

