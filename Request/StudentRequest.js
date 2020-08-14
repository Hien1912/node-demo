const { default: validator } = require("validator");
const { query, body } = require("express-validator");

module.exports = {
    index: [
        query("page").isInt({ gt: 0 }).toInt(),
        query("page").isInt({ gt: 0 }).toInt()
    ]
}

// module.exports = {
//     index: async ({ query: { page, per_page } }, res, next) => {
//         let errors = {};
//         if ((page || page == '') && !validator.isInt(page, { gt: 0 })) errors.page = "The Page must be Integer greater than 0";
//         if ((per_page || per_page == '') && !validator.isInt(per_page, { gt: 0 })) errors.per_page = "The Page must be Integer greater than 0";
//         if (errors.page || errors.per_page) res.status(422).send(errors);

//         next();
//     },

//     store: async (req, res, next) => {
//         let { body: { code, name, class: className, dob, avatar } } = req;
//         let errors = {};
//         if (code == null || code == undefined || code == '') errors.code = "The Code is required";
//         if (!validator.isAscii(code) && !errors.code) errors.code = "The Code must be ASCII character";
//         if (code.length > 10 && !errors.code) errors.code = "The Code may not be greater than 10 characters";

//         if (name == null || name == undefined || name == '') errors.name = "The name is required";
//         if (name.length > 50 && !errors.name) errors.name = "The name may not be greater than 50 characters";

//         if (className == null || className == undefined || className == '') errors.class = "The Class is required";
//         if (className.length > 10 && !errors.className) errors.class = "The class may not be greater than 10 characters";

//         if (dob == null || dob == undefined || dob == '') errors.dob = "The Date of birth is required";

//         if (errors.code || errors.name || errors.class || errors.dob) res.status(422).send(errors);

//         next();
//     }
// }