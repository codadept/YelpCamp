const   express             = require('express'),
        router              = express.Router(),
        catchAsync          = require('../utils/catchAsync'),
        ExpressError        = require('../utils/ExpressError'),
        Campground          = require('../models/campground'),
        {campgroundSchema}  = require('../schemas')



const validateCampground = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}

router.get('', catchAsync(async (req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}))

router.get('/new', (req, res)=>{
    res.render('campgrounds/new')
})

router.post('', validateCampground ,catchAsync(async (req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400)
    const campground = new Campground(req.body.campground)
    await campground.save()
    req.flash('success','Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

// KEEP THIS BELOW ELSE EVERY TIME YOU GO TO CAMPGROUND/SOMETHING, ONLY THIS WILL GET EXECUTED
router.get('/:id', catchAsync(async (req, res, next)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if(!campground){
        req.flash('error','Cannot find that campground!');
        return res.redirect('/campgrounds')
    };
    res.render('campgrounds/show',{campground}) 
}))

router.get('/:id/edit', catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error','Cannot find that campground you want to edit!');
        return res.redirect('/campgrounds')
    };
    res.render('campgrounds/edit',{campground})
}))

router.put('/:id', validateCampground ,catchAsync(async (req,res)=>{
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground},{new: true})
    req.flash('success','Successfully updated Campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', catchAsync(async (req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully deleted Campground!')
    res.redirect('/campgrounds')
}))

module.exports = router