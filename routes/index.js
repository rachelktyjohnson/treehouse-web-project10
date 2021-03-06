var express = require('express');
var router = express.Router();

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

/* GET home page. */
router.get('/', asyncHandler(async(req,res)=>{
  //res.render('index', { title: 'SQL Library Manager' });
  res.redirect('/books');
}));

module.exports = router;
