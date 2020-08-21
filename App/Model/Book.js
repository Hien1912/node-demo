const DB = require("../../configs/database");
const Book = {} || Book;


Book.get = async (query) => {
    let { per_page = 10, page = 1 } = query;

    per_page = parseInt(per_page);
    page = parseInt(page);
    let offset = (page - 1) * per_page;

    return new Promise((resolve, reject) => {
        Promise.all([
            DB.table("books").limit(per_page).offset(offset),
            DB.table('books').count({ total: 'id' })
        ]).then(raw_data => {
            let [books, [{ total }]] = raw_data;

            resolve({
                data: books,
                meta: {
                    total_records: total,
                    current_page: page,
                    total_page: Math.ceil(total / per_page),
                    per_page: per_page,
                }
            })
        }).catch(err => reject({ code: 500, msg: err }));
    });
};

Book.create = async (data) => {
    return new Promise((resolve, reject) => {
        DB.table("books").insert(data)
            .then(([id]) => Book.getById(id))
            .then(book => resolve(book))
            .catch(err => reject(err.code == 404 ? { code: err.code, msg: err.msg } : { code: 500, msg: err }));
    });
}

Book.getById = async (id) => {
    return new Promise((resolve, reject) => {
        DB.table("books").where({ id }).first()
            .then(book => {
                if (!book) reject({ code: 404, msg: "Not Found" });
                resolve({
                    data: book,

                    update: async (data) => {
                        data.updated_at = DB.raw("now()");
                        return new Promise((resolve, reject) => {
                            DB.table("books").where({ id }).update(data)
                                .then(() => Book.getById(id))
                                .then(std => resolve(std))
                                .catch(err => reject({ code: 500, msg: err }));
                        });
                    },

                    destroy: async () => {
                        DB.table("books").where({ id }).del()
                            .then(() => resolve(null))
                            .catch(err => reject({ code: 500, msg: err }));
                    }
                });
            })
            .catch(err => reject({ code: 500, msg: err }));
    });
}

module.exports = Book