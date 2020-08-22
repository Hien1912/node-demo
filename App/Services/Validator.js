const DB = require("../../configs/database");

const Validator = {};

Validator.unique = async (table, field, value, ...options) => {
    let sql = DB(table).count({ unique: "id" }).where(field, value).toQuery();
    if (options.length > 1) {
        sql = DB(table).count({ unique: "id" }).where(field, value).where(options[0], "<>", options[1]).toQuery();
    }

    return new Promise((resolve, reject) => {
        DB.raw(sql)
            .then(([[{ unique }]]) => {
                if (unique > 0) resolve(false);
                resolve(true);
            }).catch(err => reject({ code: 500, msg: err }));
    });
};

Validator.required = (value) => {
    let valid;
    switch (value) {
        case undefined:
            valid = false;
            break;
        case null:
            valid = false;
            break;
        case '':
            valid = false;
            break;
        default:
            valid = true;
            break;

    }

    return valid;
}

module.exports = Validator;