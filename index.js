const   express                             = require('express'),
        app                                 = express(),
        methodOverride                      = require('method-override'),
        path                                = require('path'),
        mongoose                            = require('mongoose'),
        ejsMate                             = require('ejs-mate'),
        ExpressError                        = require('./utils/ExpressError'),
        campgrounds                         = require('./routes/campgrounds'),
        reviews                             = require('./routes/reviews')

mongoose.connect("mongodb://localhost:27017/yelp-camp",{
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

app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

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