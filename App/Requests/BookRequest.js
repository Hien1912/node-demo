const DB = require('../../configs/database');
const { body } = require('express-validator');

const Bookrequest = {};

let code = () => {
    return body('code')
        .isString().withMessage('The code must be a string')
        .isLength({ min: 1, max: 10 }).withMessage("The code is required and least than or equal 10 characters")
        .custom(async code => {
            const count = await DB('books').count({ isExist: "id" }).where({ code: code });
            if (count) {
                let [{ isExist }] = count;
                return isExist > 0 ? Promise.reject("Code already in books") : Promise.resolve(true);
            } else {
                return Promise.reject("Unknown erorrs");
            }
        })
}

let title = () => {
    return body('title')
        .isString().withMessage("The title must be a string")
        .isLength({ min: 1, max: 70 }).withMessage("The title is required and least than or equal 70 characters")
}

let total_pages = () => {
    return body('total_pages')
        .isInt({ gt: 0 }).withMessage("The total pages must be a integer greater than 0")
        .isLength({ min: 1 }).withMessage("the total pages is required").toInt()
}

let author_name = () => {
    return body('author_name')
        .isString().withMessage("The Author name must be a string")
        .isLength({ min: 1, max: 50 }).withMessage("the Author name is required and least than or equal 50 characters")
}

Bookrequest.store = [code(), title(), total_pages(), author_name()];
Bookrequest.update = [title(), total_pages(), author_name()];
Bookrequest.checkCodeUpdate = async (req, res, next) => {
    let { body: { code }, params: { id } } = req;

    let count = await DB("books").count({ isExist: 'id' }).where({ code }).where("id", "<>", id);
    if (count) {
        let [{ isExist }] = count;
        isExist > 0 ? res.status(422).send({
            errors: {
                avatar: {
                    "msg": "Code already in books",
                    "param": "code",
                    "location": "body"
                }
            }
        }) : next();
    } else {
        res.sendStatus(500);
    }
}


module.exports = Bookrequest;