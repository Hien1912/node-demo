const DB = require('../../configs/database');
const { body, query } = require('express-validator');

const Bookrequest = {};


Bookrequest.store = [
    body('code').isString().withMessage('The code must be a string')
        .isLength({ min: 1, max: 10 }).withMessage("The code is required and least than or equal 10 characters")
        .custom(async code => {
            const books = await DB('books').where({ code: code });
            console.log(books);
            if (books.length > 0)
                return Promise.reject("Code already in books");
        }),
    body('title').isString().withMessage("The title must be a string")
        .isLength({ min: 1, max: 191 }).withMessage("The code is required and least than or equal 191 characters"),
    body('total_pages').isInt({ gt: 0 }).withMessage("The total pages must be a integer greater than 0")
        .isLength({ min: 1 }).withMessage("the total pages is required").toInt(),
    body('author_name').isString().withMessage("The Author name must be a string")
        .isLength({ min: 1, max: 100 }).withMessage("the Author name is required and least than or equal 100 characters")
]


Bookrequest.update = [
    body('code').isString().withMessage('The code must be a string')
        .isLength({ min: 1, max: 10 }).withMessage("The code is required and least than or equal 10 characters")
        .custom(async code => {
            const books = await DB('books').where({ code: code });
            console.log(books);
            if (books.length > 0)
                return Promise.reject("Code already in books");
        }),
    body('title').isString().withMessage("The title must be a string")
        .isLength({ min: 1, max: 191 }).withMessage("The code is required and least than or equal 191 characters"),
    body('total_pages').isInt({ gt: 0 }).withMessage("The total pages must be a integer greater than 0")
        .isLength({ min: 1 }).withMessage("the total pages is required").toInt(),
    body('author_name').isString().withMessage("The Author name must be a string")
        .isLength({ min: 1, max: 100 }).withMessage("the Author name is required and least than or equal 100 characters")
];


module.exports = Bookrequest;