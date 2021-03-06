const { query, body } = require("express-validator");
const { default: validator } = require("validator");

const PaginateRequest = [
    query('page').custom(page => {
        let [isNull, isEmpty, isInt] = [
            tmp = (page === undefined || page === null),
            page === '',
            !tmp ? validator.isInt(page, { gt: 0 }) : false
        ];

        if (!isNull && (isEmpty || !isInt))
            return Promise.reject("The page must be a integer and greater than 0");

        return Promise.resolve(true);
    }),
    query('per_page').custom(per_page => {
        let [isNull, isEmpty, isInt] = [
            tmp = (per_page === undefined || per_page === null),
            per_page === '',
            !tmp ? validator.isInt(per_page, { gt: 0 }) : false
        ];

        if (!isNull && (isEmpty || !isInt))
            return Promise.reject("The per_page must be a integer and greater than 0");

        return Promise.resolve(true);
    })
];

module.exports = PaginateRequest;