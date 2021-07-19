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
    res.render('new_book', {book: {}, title: "New Book"})
}));

/* POST new book form data */
router.post('/new', asyncHandler(async(req,res)=>{
    if (req.body.image===""){
        req.body.image= "https://via.placeholder.com/200x300?text=Book"
    }
    let book;
    try{
        let book = await Book.create(req.body);
        res.redirect('/books/'+book.id);
    } catch (error) {
        if (error.name==="SequelizeValidationError"){
            book = await Book.build(req.body);
            res.render("new_book",{
                book:book,
                errors: error.errors,
                title: "New Book"
            })
        }
    }

}));

/////////////////READ//////////////////

/* GET home page. */
router.get('/', asyncHandler(async(req,res)=>{
    const books = await Book.findAll();
    res.render('index', {books, title:"SQL Library Manager"})
}));

/* GET individual book. */
router.get('/:id', asyncHandler(async(req,res, next)=>{
    const book = await Book.findByPk(req.params.id);
    if (book){
        res.render('single',{book, title:book.title})
    } else {
        const err = new Error();
        err.status = 404;
        err.message = "No book exists with that ID";
        next(err);
    }

}))

/////////////////UPDATE//////////////////

/* GET update book */
router.get('/:id/update', asyncHandler(async(req,res, next)=>{
    const book = await Book.findByPk(req.params.id);
    if (book){
        res.render('update_book', {book:book, title:"Update Book"})
    } else {
        const err = new Error();
        err.status = 404;
        err.message = "No book exists with that ID";
        next(err);
    }


}))

/* POST update book */
router.post('/:id/update', asyncHandler(async(req,res, next)=>{
    const book = await Book.findByPk(req.params.id);
    if(book){
        try{
            await book.update(req.body);
            res.redirect('/books/'+book.id);
        } catch (error) {
            if (error.name==="SequelizeValidationError"){
                res.render("update_book",{
                    book:book,
                    errors: error.errors,
                    title: "Update Book"
                })
            }
        }
    } else {
        const err = new Error();
        err.status = 404;
        err.message = "No book exists with that ID";
        next(err);
    }

}))

/////////////////DELETE//////////////////
router.get('/:id/delete', asyncHandler(async(req,res, next)=>{
    const book = await Book.findByPk(req.params.id);
    if(book){
        res.render('delete', {book:book, title:"Delete Book?"})
    } else {
        const err = new Error();
        err.status = 404;
        err.message = "No book exists with that ID";
        next(err);
    }
}))

router.post('/:id/delete', asyncHandler(async(req,res, next)=>{
    const book = await Book.findByPk(req.params.id);
    if(book){
        await book.destroy();
        res.redirect('/');
    } else {
        const err = new Error();
        err.status = 404;
        err.message = "No book exists with that ID";
        next(err);
    }
}))

module.exports = router;
