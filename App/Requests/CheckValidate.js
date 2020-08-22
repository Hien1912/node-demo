const { validationResult } = require("express-validator");

const checkValidate = async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }
    return next();
}

module.exports = checkValidate;