const { DB } = require("../configs/database");

module.exports = {
    get: async ({ page = 1 }) => {
        return new Promise((resolve, reject) => {
            Promise.all([
                DB('books')
                    .select()
                    .limit(10)
                    .offset((page - 1) * 10),

                DB("books").count({ total: 'id' })
            ]).then(([books, [{ total }]]) => {
                if (books.length == 0) reject({ status: 404, err: "Not found" });
                resolve({
                    status: 200,
                    data: {
                        data: books,
                        meta: {
                            current_page: page,
                            total: total,
                            last_page: Math.ceil(total / 10)
                        }
                    }
                });
            }).catch((reason) => {
                reject({ status: 500, err: reason });
            });
        });
    },

    create: async (data) => {
        return new Promise((resolve, reject) => {
            DB('books').insert(data)
                .then(([id]) => {
                    return DB('books').where({ id: id }).first();
                })
                .then(book => {
                    resolve({
                        status: 201,
                        data: book
                    });
                }).catch((err) => {
                    reject({ status: 500, err });
                });
        });
    },

    getById: async ({ id }) => {
        return new Promise((resolve, reject) => {
            DB('books').where({ id, id }).first()
                .then(book => {
                    if (!book) reject({ status: 404, err: "Not Found" })
                    resolve({
                        status: 200,
                        data: book
                    });
                }).catch((err) => {
                    reject({ status: 500, err });
                });
        });
    },

    update: async (data, { id }) => {
        data.updated_at = DB.raw('default');
        return new Promise((resolve, reject) => {
            DB('books').where({ id: id }).first().then(book => {
                if (!book) reject({ status: 404, err: "Not Found" })
                return DB("books").where({ id: id }).update(data);
            }).then(() => {
                return DB('books').where({ id: id }).first();
            }).then(book => {
                resolve({
                    status: 200,
                    data: book
                });
            }).catch(err => {
                reject({ status: 500, err });
            })
        });
    },

    destroy: async ({ id }) => {
        return new Promise((resolve, reject) => {
            DB('books').where({ id: id }).first().then(book => {
                if (!book) reject({ status: 404, err: "Not Found" })
                return DB("books").where({ id: id }).del();
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

}