const { validationResult } = require("express-validator");
const fs = require("fs");
const checkValidate = async (req, res, next) => {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let file = req.file;
        if (file) {
            fs.unlink(file.path, (err) => console.log(err));
        }
        return res.status(422).json({ errors: errors.mapped() });
    }
    return next();
}

module.exports = checkValidate;