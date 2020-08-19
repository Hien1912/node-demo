const DB = require("../../configs/database");
const Student = {} || Student;


Student.get = async (query) => {
    let { per_page = 10, page = 1 } = query;

    per_page = parseInt(per_page);
    page = parseInt(page);
    let offset = (page - 1) * per_page;

    return new Promise((resolve, reject) => {
        Promise.all([
            DB.table("students").whereNull('deleted_at').limit(per_page).offset(offset),
            DB.table('students').count({ total: 'id' }).whereNull('deleted_at')
        ]).then(results => {
            let [students, [{ total }]] = results;

            resolve({
                data: students,
                meta: {
                    total_records: total,
                    current_page: page,
                    total_page: Math.ceil(total / per_page),
                    per_page: per_page,
                }
            })
        }).catch(err => reject(err));
    });
};

Student.getTrashed = async (query) => {
    let { per_page = 10, page = 1 } = query;

    per_page = parseInt(per_page);
    page = parseInt(page);
    let offset = (page - 1) * per_page;

    return new Promise((resolve, reject) => {
        Promise.all([
            DB.table("students").whereNotNull('deleted_at').limit(per_page).offset(offset),
            DB.table('students').count({ total: 'id' }).whereNotNull('deleted_at')
        ]).then(results => {
            let [students, [{ total }]] = results;

            resolve({
                data: students,
                meta: {
                    total_records: total,
                    current_page: page,
                    total_page: Math.ceil(total / per_page),
                    per_page: per_page,
                }
            })
        }).catch(err => reject({ code: 500, msg: err }));
    });
}

Student.create = async (data) => {
    return new Promise((resolve, reject) => {
        DB.table("students").insert(data)
            .then(([id]) => Student.getById(id))
            .then(student => resolve(student))
            .catch(err => reject(err.code == 404 ? { code: err.code, msg: err.msg } : { code: 500, msg: err }));
    });
}

Student.getById = async (id) => {
    return new Promise((resolve, reject) => {
        DB.table("students").where({ id }).first()
            .then(student => {
                if (!student) reject({ code: 404, msg: "Not Found" });
                resolve({
                    data: student,

                    update: async (data) => {
                        data.updated_at = DB.raw("now()");
                        return new Promise((resolve, reject) => {
                            DB.table("students").where({ id }).update(data)
                                .then(() => Student.getById(id))
                                .then(std => resolve(std))
                                .catch(err => reject({ code: 500, msg: err }));
                        });
                    },

                    destroy: async () => {
                        DB.table("students").where({ id }).del()
                            .then(() => resolve(null))
                            .catch(err => reject({ code: 500, msg: err }));
                    }
                });
            })
            .catch(err => reject({ code: 500, msg: err }));
    });
}

module.exports = Student