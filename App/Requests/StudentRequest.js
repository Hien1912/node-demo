const DB = require('../../configs/database');
const { body } = require('express-validator');
const fs = require("fs");

const StudentRequest = {};

let code = () => {
    return body('code').isString().withMessage('The code must be a string')
        .isLength({ min: 1, max: 10 }).withMessage("The code is required and least than or equal 10 characters")
        .custom(async code => {

            const count = await DB('students').count({ isExist: "id" }).where({ code: code });
            if (count) {
                let [{ isExist }] = count;
                return isExist > 0 ? Promise.reject("Code already in students") : Promise.resolve(true);
            } else {
                return Promise.reject("Unknown erorrs");
            }
        })
}

let name = () => {
    return body('name')
        .isString().withMessage("The name must be a string")
        .isLength({ min: 1, max: 70 }).withMessage("The name is required and least than or equal 70 characters")
}

let dob = () => {
    return body('dob')
        .isDate().withMessage("The dob must be a date format")
        .custom(dob => {
            if (Date.now() <= Date.parse(dob)) {
                return Promise.reject("The dob must before today")
            };

            return Promise.resolve(true)
        })
}

let className = () => {
    return body('class')
        .isString().withMessage("The class must be a string")
        .isLength({ min: 1, max: 10 }).withMessage("The class is required and least than or equal 10 characters")
}

StudentRequest.store = [code(), name(), dob(), className()];
StudentRequest.update = [name(), dob(), className()];

StudentRequest.fileStore = async (req, res, next) => {
    let { file } = req;
    if (file) {
        let ext = file.mimetype;
        switch (ext) {
            case "image/gif":
                return next();
            case "image/png":
                return next();
            case "image/jpeg":
                return next();
            default:
                fs.unlink(file.path, (err) => console.log(err));
                res.status(422).send({
                    errors: {
                        avatar: {
                            "msg": "The avatar must be image mime jpeg, png, gif",
                            "param": "avatar",
                            "location": "file"
                        }
                    }
                });
        }
    } else {
        res.status(422).send({
            errors: {
                avatar: {
                    "msg": "The avatar is required",
                    "param": "avatar",
                    "location": "file"
                }
            }
        });
    }

}

StudentRequest.fileUpdate = async (req, res, next) => {
    let { file } = req;
    if (file) {
        let ext = file.mimetype;
        switch (ext) {
            case "image/gif":
                return next();
            case "image/png":
                return next();
            case "image/jpeg":
                return next();
            default:
                fs.unlink(file.path, (err) => console.log(err));
                res.status(422).send({
                    errors: {
                        avatar: {
                            "msg": "The avatar must be image mime jpeg, png, gif",
                            "param": "avatar",
                            "location": "file"
                        }
                    }
                });
        }
    } else {
        next();
    }
}

StudentRequest.checkCodeUpdate = async (req, res, next) => {
    let { body: { code }, params: { id } } = req;
    let count = await DB("students").count({ isExist: 'id' }).where({ code }).where("id", "<>", id);
    if (count) {
        let [{ isExist }] = count;
        isExist > 0 ? res.status(422).send({
            errors: {
                avatar: {
                    "msg": "Code already in students",
                    "param": "code",
                    "location": "body"
                }
            }
        }) : next();
    } else {
        res.sendStatus(500);
    }
}

module.exports = StudentRequest;