const DB = require('../../configs/database');
const { body } = require('express-validator');

const BorowRequest = {};

let student_code = () => {
    return body('student_code')
        .isString().withMessage('The student_code must be a string')
        .isLength({ min: 1, max: 10 }).withMessage("The student_code is required and least than or equal 10 characters")
        .custom(async student_code => {
            const count = await DB('students').count({ isExist: "id" }).where({ code: student_code });
            if (count) {
                let [{ isExist }] = count;
                return isExist == 0 ? Promise.reject("student_code does not exist") : Promise.resolve(true);
            } else {
                return Promise.reject("Unknown erorrs");
            }
        })
};

let due_date = () => {
    return body('due_date')
        .isDate().withMessage("The due_date must be a date format")
        .custom(due_date => {
            if (Date.now() >= Date.parse(due_date)) {
                return Promise.reject("The due_date must after today")
            };
            return Promise.resolve(true)
        })
};

let book_code = () => {
    return body('book_code')
        .isArray().withMessage("The book_code must be a array")
        .isLength({ min: 1 }).withMessage("The book_code must be greater or equal 1")
        .custom(async book_code => {
            let books = await DB("books").count({ count: 'id' }).whereIn('code', book_code);
            if (books) {
                let [{ count }] = books;
                return count == book_code.length ? Promise.resolve(true) : Promise.reject("The book_code does't exist in books");
            } else {
                return Promise.reject("Unknown erorrs");
            }
        });

}

BorowRequest.store = [student_code(), due_date(), book_code()];
BorowRequest.update = [student_code(), due_date(), book_code()];

module.exports = BorowRequest;