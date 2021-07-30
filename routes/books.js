var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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
    res.render('new-book', {book: {}, title: "New Book"})
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
            res.render("new-book",{
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
    const searchTerm = req.query.s || "";
    const page = req.query.p || 1;
    const books_per_page = 10;
    const offset = (page-1)*books_per_page;
    let results = true;
    const books = await Book.findAll({
        where:{
            [Op.or]: [
                {title: {
                    [Op.substring]: searchTerm
                    }
                },
                {author: {
                        [Op.substring]: searchTerm
                    }
                },
                {genre: {
                        [Op.substring]: searchTerm
                    }
                },
                {year: {
                        [Op.substring]: searchTerm
                    }
                },
            ]
        },
        limit:books_per_page,
        offset:offset
    })
    const count = await Book.count({
        where:{
            [Op.or]: [
                {title: {
                        [Op.substring]: searchTerm
                    }
                },
                {author: {
                        [Op.substring]: searchTerm
                    }
                },
                {genre: {
                        [Op.substring]: searchTerm
                    }
                },
                {year: {
                        [Op.substring]: searchTerm
                    }
                },
            ]
        }
    })
    if (count<=0){
        results = false;
    }

    let end_index = page*10;
    let start_index = end_index-books_per_page+1;
    if (end_index>count){
        end_index = count
    }
    const pages = Math.ceil(count/books_per_page);
    res.render('index', {
        books,
        title:"SQL Library Manager",
        searchTerm,
        results,
        count,
        start_index,
        end_index,
        pages,
        page
    })
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
        res.render('update-book', {book:book, title:"Update Book"})
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
                res.render("update-book",{
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
