const   express                                         = require('express'),
        router                                          = express.Router(),
        catchAsync                                      = require('../utils/catchAsync'),
        {isLoggedIn,validateCampground,isAuthor}        = require('../middleware'),
        campgrounds                                     = require('../controllers/campgrounds'),
        multer                                          = require('multer'),
        {storage}                                       = require('../cloudinary'),
        upload                                          = multer({storage})



router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn ,upload.array('image') ,validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new',isLoggedIn ,campgrounds.renderNewForm)

// KEEP THIS BELOW ELSE EVERY TIME YOU GO TO CAMPGROUND/SOMETHING, ONLY THIS WILL GET EXECUTED

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn ,isAuthor,upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor ,catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',isLoggedIn, isAuthor ,catchAsync(campgrounds.renderEditForm))

module.exports = router