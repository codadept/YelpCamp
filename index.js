const e = require('express');

const   express                             = require('express'),
        app                                 = express(),
        methodOverride                      = require('method-override'),
        path                                = require('path'),
        mongoose                            = require('mongoose'),
        Campground                          = require('./models/campground'),
        ejsMate                             = require('ejs-mate'),
        catchAsync                          = require('./utils/catchAsync'),
        ExpressError                        = require('./utils/ExpressError'),
        {campgroundSchema, reviewSchema}    = require('./schemas'),
        Review                              = require('./models/review')

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


const validateCampground = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}

const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}


app.get('/campgrounds', catchAsync(async (req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}))

app.get('/campgrounds/new', (req, res)=>{
    res.render('campgrounds/new')
})

app.post('/campgrounds', validateCampground ,catchAsync(async (req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400)
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

// KEEP THIS BELOW ELSE EVERY TIME YOU GO TO CAMPGROUND/SOMETHING, ONLY THIS WILL GET EXECUTED
app.get('/campgrounds/:id', catchAsync(async (req, res, next)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews')
    res.render('campgrounds/show',{campground}) 
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit',{campground})
}))

app.put('/campgrounds/:id', validateCampground ,catchAsync(async (req,res)=>{
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground},{new: true})
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

app.post('/campgrounds/:id/reviews',validateReview,catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save();
    await campground.save();
    res.redirect('/campgrounds/'+campground._id)
}))

app.delete('/campgrounds/:id/reviews/:reviewId',catchAsync(async (req,res)=>{
    const {id,reviewId} = req.params
    await Campground.findByIdAndUpdate(id,{$pull:{reviews: reviewId}},{useFindAndModify:false})
    await Review.findByIdAndDelete(reviewId,{useFindAndModify:false});
    res.redirect(`/campgrounds/${id}`)
}))

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