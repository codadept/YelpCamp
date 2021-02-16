const   express                                         = require('express'),
        router                                          = express.Router(),
        catchAsync                                      = require('../utils/catchAsync'),
        Campground                                      = require('../models/campground'),
        {isLoggedIn,validateCampground,isAuthor}        = require('../middleware')



router.get('/', catchAsync(async (req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}))

router.get('/new',isLoggedIn ,(req, res)=>{
    res.render('campgrounds/new')
})

router.post('/',isLoggedIn ,validateCampground ,catchAsync(async (req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400)
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id;
    await campground.save()
    req.flash('success','Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

// KEEP THIS BELOW ELSE EVERY TIME YOU GO TO CAMPGROUND/SOMETHING, ONLY THIS WILL GET EXECUTED
router.get('/:id', catchAsync(async (req, res, next)=>{
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error','Cannot find that campground!');
        return res.redirect('/campgrounds')
    };
    res.render('campgrounds/show',{campground}) 
}))

router.get('/:id/edit',isLoggedIn, isAuthor ,catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error','Cannot find that campground you want to edit!');
        return res.redirect('/campgrounds')
    };
    res.render('campgrounds/edit',{campground})
}))

router.put('/:id',isLoggedIn ,validateCampground, isAuthor ,catchAsync(async (req,res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground},{new: true})
    req.flash('success','Successfully updated Campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id',isLoggedIn,isAuthor ,catchAsync(async (req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully deleted Campground!')
    res.redirect('/campgrounds')
}))

module.exports = router