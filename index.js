const   express         = require('express'),
        app             = express(),
        methodOverride  = require('method-override'),
        path            = require('path'),
        mongoose        = require('mongoose'),
        Campground      = require('./models/campground')

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

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}))

app.get('/campgrounds', async (req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
})

app.get('/campgrounds/new', (req, res)=>{
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req,res)=>{
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})

// KEEP THIS BELOW ELSE EVERY TIME YOU GO TO CAMPGROUND/SOMETHING, ONLY THIS WILL GET EXECUTED
app.get('/campgrounds/:id', async (req, res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show',{campground})
    
})

app.get('/campgrounds/:id/edit', async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit',{campground})
})

app.put('/campgrounds/:id', async (req,res)=>{
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground},{new: true})
    res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async (req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})

const PORT = 3000;
app.listen(PORT,()=>{
    console.log('THE SERVER RUNNING ON PORT ', PORT)
})