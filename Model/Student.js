const { DB } = require("../configs/database");
const fs = require('fs');

const Student = {};

Student.get = async ({ page = 1, per_page = 10 }) => {

    let raw_query = '(select count(*) from `borrows` where `borrows`.`student_code` = `students`.`code`)';
    return new Promise((resolve, reject) => {
        let sql = DB('students').select(['*', { borrows_count: DB.raw(raw_query) }]).whereNull("deleted_at").limit(+per_page).offset((+page - 1) * +per_page).toQuery();
        let res = {};
        Promise.all([
            DB.raw(sql),
            DB.table("students").count({ total: 'id' })
        ]).then(([students, [{ total }]]) => {
            res.data = students;
            res.meta = {
                current_page: +page,
                total: total,
                last_page: Math.ceil(total / +per_page)
            }
        }).catch((err) => {
            reject({ status: 500, err });
        });

        if (students.length == 0) reject({ status: 404, err: "Not found" });

        resolve(res);
    })
}

Student.create = async (data) => {
    return new Promise((resolve, reject) => {
        DB('students').insert(data)
            .then(id => {
                resolve(id);
            }).catch((err) => {
                reject(500);
            });
    });
}


Student.getById = async ({ id }) => {
    console.log(DB.queryBuilder().table("students").where({ id: id }).first());
    return new Promise((resolve, reject) => {
        DB.table("students").where({ id: id }).first().then(student => {
            if (!student) reject(404);
            let Std = {};

            Std.data = student;

            Std.update = async (data) => {
                return new Promise((resolve, reject) => {
                    data.updated_at = DB.raw('default');
                    DB.table("students").where({ id: id }).update(data)
                        .then(() => Student.getById({ id }).then(student => resolve(student)).catch(err => reject(500)))
                        .catch(err => reject(500))
                });
            }

            Std.delete = async () => {
                return new Promise((resolve, reject) => {
                    if (student.deleted_at)
                        return reject(404);

                    return Std.update({ deleted_at: DB.raw("now()") }, { id }).then(() => resolve(null)).catch(err => reject(500));

                });
            }

            Std.restore = async () => {
                return new Promise((resolve, reject) => {
                    if (student.deleted_at)
                        return Std.update({ deleted_at: null }, { id }).then((st) => resolve(st)).catch(err => reject(500));
                    return reject(404);
                });
            }

            Std.destroy = async () => {
                return new Promise((resolve, reject) => {
                    DB.table("students").where({ id: id }).del().then(() => resolve(null)).catch(err => reject(500))
                });
            }

            resolve(Std);

        }).catch(err => {
            reject(500);
        });
    });
}


module.exports = Student;