const DB = require('../../configs/database');

const BookRequest = {} || BookRequest;

BookRequest.index = async (req, res, next) => {
    let { query: { per_page, page } } = req;

    if (per_page && (/^([0-9]+)?[1-9]+([0-9]+)?$/.test(per_page))) {
        res.status(422).json({
            errors: {
                per_page: "The per_page must be integer"
            }
        })
    }

    return next();


}

module.exports = BookRequest;