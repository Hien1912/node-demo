const DB = require("../../configs/database");
const Borrow = {} || Borrow;

let id, name, avatar, code, title, dob, class_name, total_pages, author_name, created_at, updated_at, deleted_at;

id = "'id', `id`";
code = "'code', `code`";
name = "'name', `name`";
avatar = "'avatar', `avatar`";
dob = "'dob', `dob`";
class_name = "'class', `class`";
title = "'title', `title`";
total_pages = "'total_pages', `total_pages`";
author_name = "'author_name', `author_name`";
created_at = "'created_at', DATE_FORMAT(`created_at`, '%Y-%m-%d %H:%i:%s')";
updated_at = "'updated_at', DATE_FORMAT(`updated_at`, '%Y-%m-%d %H:%i:%s')";
deleted_at = "'deleted_at', DATE_FORMAT(`deleted_at`, '%Y-%m-%d %H:%i:%s')";


const student_raw = {
    student: DB('students')
        .select(DB.raw(`JSON_OBJECT(${id}, ${code}, ${name}, ${avatar}, ${class_name}, ${dob}, ${created_at}, ${updated_at}, ${deleted_at})`))
        .whereRaw("`students`.`code` = `borrows`.`student_code`")
};

const books_raw = {
    books: DB("books")
        .select(DB.raw(`JSON_ARRAYAGG(JSON_OBJECT (${id}, ${code}, ${title}, ${total_pages}, ${author_name}, ${created_at}, ${updated_at}))`))
        .innerJoin('book_borrow', 'books.code', 'book_borrow.book_code')
        .whereRaw(DB.raw("`book_borrow`.`borrow_id`  = `borrows`.`id`"))
}

Borrow.get = async (query) => {
    let { per_page, page } = query;
    let offset = (page - 1) * per_page;

    return new Promise((resolve, reject) => {
        Promise.all([
            DB.table("borrows")
                .select(["borrows.*", student_raw, books_raw])
                .whereNull("returned_at")
                .where("due_date", ">=", DB.raw("curdate()"))
                .limit(per_page).offset(offset),
            DB.table('borrows').whereNull("returned_at").where("due_date", ">=", DB.raw("curdate()")).count({ total: 'id' })
        ]).then(raw_data => {
            let [borrows, [{ total }]] = raw_data;

            let total_page = Math.ceil(total / per_page);
            if (total_page < page) reject({ code: 404, msg: "Not Found" });

            let data = borrows.map(borrow => {
                borrow.student = JSON.parse(borrow.student);
                borrow.books = JSON.parse(borrow.books);
                return borrow;
            });

            resolve({
                data: data,
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

Borrow.getReturned = async (query) => {
    let { per_page, page } = query;
    let offset = (page - 1) * per_page;

    return new Promise((resolve, reject) => {
        Promise.all([
            DB.table("borrows")
                .select(["borrows.*", student_raw, books_raw])
                .whereNotNull('returned_at')
                .limit(per_page).offset(offset),
            DB.table('borrows').whereNotNull('returned_at').count({ total: 'id' })
        ]).then(raw_data => {

            let [borrows, [{ total }]] = raw_data;

            let total_page = Math.ceil(total / per_page);
            if (total_page < page) reject({ code: 404, msg: "Not Found" });

            let data = borrows.map(borrow => {
                borrow.student = JSON.parse(borrow.student);
                borrow.books = JSON.parse(borrow.books);
                return borrow;
            });

            resolve({
                data: data,
                meta: {
                    total_records: total,
                    current_page: page,
                    total_page: total_page,
                    per_page: per_page,
                }
            })
        }).catch(err => reject(err));
    });
};

Borrow.getDue = async (query) => {
    let { per_page, page } = query;
    let offset = (page - 1) * per_page;

    return new Promise((resolve, reject) => {
        Promise.all([
            DB.table("borrows")
                .select(["borrows.*", student_raw, books_raw])
                .whereNull('returned_at')
                .where("due_date", "<", DB.raw("curdate()"))
                .limit(per_page).offset(offset),
            DB.table('borrows').whereNull('returned_at').where("due_date", "<", DB.raw("curdate()")).count({ total: 'id' })
        ]).then(raw_data => {
            let [borrows, [{ total }]] = raw_data;

            let total_page = Math.ceil(total / per_page);
            if (total_page < page) reject({ code: 404, msg: "Not Found" });

            let data = borrows.map(borrow => {
                borrow.student = JSON.parse(borrow.student);
                borrow.books = JSON.parse(borrow.books);
                return borrow;
            });

            resolve({
                data: data,
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

Borrow.create = async (dataCreate) => {
    let { due_date, student_code } = dataCreate;
    let data = { due_date, student_code };
    return new Promise((resolve, reject) => {
        DB.table("borrows").insert(data)
            .then(([id]) => Borrow.getById(id))
            .then(borrow => resolve(borrow))
            .catch(err => reject(err.code == 404 ? { code: err.code, msg: err.msg } : { code: 500, msg: err }));
    });
}

Borrow.getById = async (id) => {
    return new Promise((resolve, reject) => {
        DB.table("borrows").select(["borrows.*", student_raw, books_raw]).where({ id }).first()
            .then(borrow => {
                if (!borrow) reject({ code: 404, msg: "Not Found" });
                borrow.student = JSON.parse(borrow.student);
                borrow.books = JSON.parse(borrow.books);

                resolve({
                    data: borrow,

                    books: () => {
                        return {
                            attach: async (book_codes) => {
                                let dataSync = book_codes.map(code => {
                                    return {
                                        book_code: code,
                                        borrow_id: borrow.id
                                    }
                                });

                                return new Promise((resolve, reject) => {
                                    DB('book_borrow').insert(dataSync)
                                        .then(() => Borrow.getById(borrow.id))
                                        .then(borrow => resolve(borrow))
                                        .catch(err => reject({ code: 500, msg: err }));
                                });
                            },

                            sync: async (book_codes) => {
                                let dataSync = book_codes.map(code => {
                                    return {
                                        book_code: code,
                                        borrow_id: borrow.id
                                    }
                                });

                                await DB("book_borrow").where({ borrow_id: borrow.id }).delete();

                                return new Promise((resolve, reject) => {
                                    DB('book_borrow').insert(dataSync)
                                        .then(() => Borrow.getById(borrow.id))
                                        .then(borrow => resolve(borrow))
                                        .catch(err => reject({ code: 500, msg: err }));
                                });
                            }
                        }
                    },

                    update: async (dataUpdate) => {

                        let { due_date, student_code } = dataUpdate;
                        let data = { due_date, student_code };
                        return new Promise((resolve, reject) => {
                            DB.table("borrows").where({ id }).update(data)
                                .then(() => Borrow.getById(id))
                                .then(std => resolve(std))
                                .catch(err => reject({ code: 500, msg: err }));
                        });
                    },

                    destroy: async () => {
                        DB.table("borrows").where({ id }).del()
                            .then(() => resolve(null))
                            .catch(err => reject({ code: 500, msg: err }));
                    }
                });
            })
            .catch(err => reject({ code: 500, msg: err }));
    });
}

module.exports = Borrow;