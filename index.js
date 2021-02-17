if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const   express                             = require('express'),
        app                                 = express(),
        methodOverride                      = require('method-override'),
        path                                = require('path'),
        mongoose                            = require('mongoose'),
        ejsMate                             = require('ejs-mate'),
        ExpressError                        = require('./utils/ExpressError'),
        campgroundRoutes                    = require('./routes/campgrounds'),
        reviewRoutes                        = require('./routes/reviews'),
        userRoutes                          = require('./routes/users'),
        session                             = require('express-session'),
        flash                               = require('connect-flash'),
        passport                            = require('passport'),
        LocalStrategy                       = require('passport-local'),
        User                                = require('./models/user'),
        mongoSanitize                       = require('express-mongo-sanitize'),
        MongoDBStore                        = require('connect-mongo')(session),
        dbUrl                               = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp',
        secret                              = process.env.SECRET || 'thisshouldbeabettersecret!'

// "mongodb://localhost:27017/yelp-camp"
mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})

const db =  mongoose.connection;
db.on('error', console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected")
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize({
    replaceWith: '_'
}))

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24*60*60 //in secs
})

store.on('error', function(e){
    console.log("SESSION STORE ERROR",e)
})

const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized:true,
    cookie: {
        httpOnly: true,    
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error   = req.flash('error');
    next()
})

app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/',userRoutes)

app.get('/',(req,res)=>{
    res.render('home')
})

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500} = err;
    if(!err.message) err.message="Oh No, Something Went Wrong";
    res.status(statusCode).render('error',{err})
})

const PORT = 3000;
app.listen(PORT,()=>{
    console.log('THE SERVER RUNNING ON PORT ', PORT)
})