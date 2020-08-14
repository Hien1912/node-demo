const { DB } = require("../configs/database");
const fs = require('fs');
module.exports = class Model {
    static table;
    static get = async ({ page = 1, per_page = 10 }) => {
        let sql = DB('students')
            .select(['*', { borrows_count: DB.raw(raw_query) }])
            .whereNull("deleted_at")
            .limit(+per_page)
            .offset((+page - 1) * +per_page)
            .toQuery();
        return new Promise((resolve, reject) => {
            Promise.all([
                DB("students").count({ total: 'id' })
            ]).then(([students, [{ total }]]) => {
                if (students.length == 0) reject({ status: 404, err: "Not found" });
                resolve({
                    status: 200,
                    data: {
                        data: students,
                        meta: {
                            current_page: +page,
                            total: total,
                            last_page: Math.ceil(total / +per_page)
                        }
                    }
                });
            }).catch((err) => {
                reject({ status: 500, err });
            });
        });
    }

    static getTrashed = async ({ page = 1, per_page = 10 }) => {
        let raw_query = '(select count(*) from `borrows` where `borrows`.`student_code` = `students`.`code`)';
        return new Promise((resolve, reject) => {
            Promise.all([
                DB('students')
                    .select(['*', { borrows_count: DB.raw(raw_query) }])
                    .whereNotNull("deleted_at")
                    .limit(per_page)
                    .offset((page - 1) * per_page),

                DB("students").count({ total: 'id' })
            ]).then(([students, [{ total }]]) => {
                if (students.length == 0) reject({ status: 404, err: "Not found" });
                resolve({
                    status: 200,
                    data: {
                        data: students,
                        meta: {
                            current_page: page,
                            total: total,
                            last_page: Math.ceil(total / per_page)
                        }
                    }
                });
            }).catch((err) => {
                reject({ status: 500, err });
            });
        });
    }


    static create = async (data) => {
        return new Promise((resolve, reject) => {
            DB('students').insert(data)
                .then(([id]) => {
                    return DB('students').where({ id: id }).first();
                })
                .then(student => {
                    resolve({
                        status: 201,
                        data: student
                    });
                }).catch((err) => {
                    reject({ status: 500, err });
                });
        });
    }

    static getById = async ({ id }) => {
        return new Promise((resolve, reject) => {
            DB('students').where({ id, id }).whereNull('deleted_at').first()
                .then(student => {
                    if (!student) reject({ status: 404, err: "Not Found" });
                    resolve({
                        status: 200,
                        data: student
                    });
                }).catch((err) => {
                    reject({ status: 500, err });
                });
        });
    }

    static update = async (data, { id }) => {
        data.updated_at = DB.raw('default');
        console.log(DB("students").where({ id: id }).update(data).raw());
        return new Promise((resolve, reject) => {
            DB('students').where({ id: id }).whereNull('deleted_at').first()
                .then(student => {
                    console.log(student);
                    if (!student) reject({ status: 404, err: "Not Found" });
                    // if (data.avatar) fs.unlink(student.avatar);
                    return DB("students").where({ id: id }).update(data);
                }).then(() => {
                    return DB('students').where({ id: id }).whereNull('deleted_at').first();
                }).then(student => {
                    resolve({
                        status: 200,
                        data: student
                    });
                }).catch(err => {
                    reject({ status: 500, err });
                })
        });
    }

    static delete = async ({ id }) => {
        return new Promise((resolve, reject) => {
            DB('students').where({ id: id }).whereNull('deleted_at').first()
                .then(student => {
                    if (!student) reject({ status: 404, data: "Not Found" })
                    return DB("students").where({ id: id }).update({ deleted_at: DB.raw('now() ') });
                }).then(() => {
                    resolve({
                        status: 204,
                        data: null
                    });
                }).catch(err => {
                    reject({ status: 500, err });
                })
        })
    }

    static restore = async ({ id }) => {
        return new Promise((resolve, reject) => {
            DB('students').where({ id: id }).whereNotNull('deleted_at').first()
                .then(student => {
                    if (!student) reject({ status: 404, err: "Not Founds" })
                    return DB("students").where({ id: id }).update({ deleted_at: null });
                }).then(() => {
                    return DB('students').where({ id: id }).whereNull('deleted_at').first();
                }).then(student => {
                    resolve({
                        status: 200,
                        data: student
                    });
                }).catch(err => {
                    reject({ status: 500, err });
                })
        })
    }

    static destroy = async ({ id }) => {
        return new Promise((resolve, reject) => {
            DB('students').where({ id: id }).first()
                .then(student => {
                    if (!student) reject({ status: 404, err: "Not Found" })
                    return DB("students").where({ id: id }).del();
                }).then(() => {
                    resolve({
                        status: 204,
                        data: null
                    });
                }).catch(err => {
                    reject({ status: 500, err });
                })
        })
    }

    static search = async (query) => {
        return new Promise((resolve, reject) => {
            resolve({
                status: 200,
                data: ""
            });

            reject({
                status: 500,
                err: ''
            });
        });
    }
}