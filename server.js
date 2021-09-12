if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
const Member = require('./models/member')
const MongoStore = require('connect-mongo');
const indexRouter = require('./routes/index')
const imageRouter = require('./routes/images')
const outfitRouter = require('./routes/outfits')
const aboutRouter = require('./routes/about')
const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session');
// const initializePassport = require('./passport-config');
const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))


// Middleware
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout','layouts/layout')
app.set('trust proxy', 1)
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(session({
    key : 'user_sid',
    secret : 'ubersecret',
    resave : false,
    saveUninitialized : false,
    cookie : {
        secure : false,
        maxAge : 60*60*1000,
        httpOnly: false,
    },
    store : new MongoStore({mongoUrl : process.env.DATABASE_URL, autoReconnect: true})
}))
app.use(express.urlencoded({extended : false}))
app.use(express.json());


// Passport.js
app.use(passport.initialize());
app.use(passport.session());
//initializePassport(passport);
app.use('/login', loginRouter)





app.use('/', indexRouter)
app.use('/images', imageRouter)
app.use('/about', aboutRouter)
//app.use('/outfits', outfitRouter)
app.use('/register', registerRouter)

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/setup', async(req,res) => {
    const exists = await Member.exists({email : 'admin'});

    if(exists) {
        res.redirect('/login');
        return;
    }
    bcrypt.genSalt(10, function(err,salt) {
        if(err) return next(err);

        bcrypt.hash("154451aA", salt, function(err, hash) {
            if(err) return next(err);
            const newAdmin = new User({
                email : 'admin',
                password : hash
            });

            newAdmin.save();
            res.redirect('/login');
        });
    })
    
})

app.listen(process.env.PORT || 3000)

module.exports = {passport};

