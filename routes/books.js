var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    }
}




/////////////////CREATE//////////////////

/* GET new book form */
router.get('/new', asyncHandler(async(req,res)=>{
    //TODO: render the new book form
}));

/* POST new book form data */
router.get('/new', asyncHandler(async(req,res)=>{
    //TODO: posts new book to database

    //TODO: redirects to new book single page
}));

/////////////////READ//////////////////

/* GET home page. */
router.get('/', asyncHandler(async(req,res)=>{
    //res.render('index', { title: 'SQL Library Manager' });
    const books = await Book.findAll();
    res.json(books);
}));

/* GET individual book. */
router.get('/:id', asyncHandler(async(req,res)=>{
    const book = await Book.findByPk(req.params.id);
    res.json(book);
    //TODO: Render actual page
}))

/////////////////UPDATE//////////////////

/* POST update book */
router.get('/:id', asyncHandler(async(req,res)=>{
    //TODO: Get the Book listing
    //TODO: Render the form page with book details
}))

/* POST update book */
router.post('/:id', asyncHandler(async(req,res)=>{
    //TODO: Get Book object
    //TODO: Update book info in database using req body
    //TODO: Redirect to book page
}))

/////////////////DELETE//////////////////
router.get('/:id/delete', asyncHandler(async(req,res)=>{
    //TODO: Get Book
    //TODO: render ARE YOU SURE page with book details
}))

router.get('/:id/delete', asyncHandler(async(req,res)=>{
    //TODO: Get Book object
    //TODO: Destroy it!
    //TODO: Redirect to home page
}))

module.exports = router;
