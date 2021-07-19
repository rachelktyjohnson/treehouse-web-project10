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
    res.render('new_book', {title: "New Book"})
}));

/* POST new book form data */
router.post('/new', asyncHandler(async(req,res)=>{
    if (req.body.image===""){
        req.body.image= "https://via.placeholder.com/200x300?text=Book"
    }
    let book = await Book.create(req.body);
    res.redirect('/books/'+book.id);
}));

/////////////////READ//////////////////

/* GET home page. */
router.get('/', asyncHandler(async(req,res)=>{
    //res.render('index', { title: 'SQL Library Manager' });
    const books = await Book.findAll();
    res.render('index', {books, title:"SQL Library Manager"})
}));

/* GET individual book. */
router.get('/:id', asyncHandler(async(req,res)=>{
    const book = await Book.findByPk(req.params.id);
    res.render('single',{book, title:book.title})
}))

/////////////////UPDATE//////////////////

/* GET update book */
router.get('/:id/update', asyncHandler(async(req,res)=>{
    const book = await Book.findByPk(req.params.id);
    res.render('update_book', {book:book, title:"Update Book"})
}))

/* POST update book */
router.post('/:id/update', asyncHandler(async(req,res)=>{
    //TODO: Get Book object
    const book = await Book.findByPk(req.params.id);
    //TODO: Update book info in database using req body
    await book.update(req.body);
    //TODO: Redirect to book page
    res.redirect('/books/'+book.id);
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
