const Borrow = require("../Model/Borrow");
const DB = require("../../configs/database");

module.exports = {
    index: async (req, res) => {
        let { query: { page, per_page } } = req;
        let query = { page: page ? +page : 1, per_page: per_page ? +per_page : 10 };
        Borrow.get(query)
            .then(borrows => res.send(borrows))
            .catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });
    },

    getReturned: async (req, res) => {
        let { query: { page, per_page } } = req;
        let query = { page: page ? +page : 1, per_page: per_page ? +per_page : 10 };
        Borrow.getReturned(query)
            .then(borrows => res.send(borrows))
            .catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });
    },

    getDue: async (req, res) => {
        let { query: { page, per_page } } = req;
        let query = { page: page ? +page : 1, per_page: per_page ? +per_page : 10 };
        Borrow.getDue(query)
            .then(borrows => res.send(borrows))
            .catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });
    },

    store: async (req, res) => {
        let { body: data } = req;
        Borrow.create(data)
            .then(borrow => {
                if (data.book_code && Array.isArray(data.book_code) && data.book_code.length > 0) {
                    borrow.books().attach(data.book_code)
                        .then(borrow => {
                            let { data } = borrow;
                            res.status(201).send(data);
                        }).catch(err => console.log(err));
                } else {
                    let { data } = borrow;
                    res.status(201).send(data)
                }
            })
            .catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });
    },

    show: async (req, res) => {
        let { params: { id } } = req;
        Borrow.getById(id)
            .then(borrow => {
                let { data } = borrow;
                res.send(data)
            }).catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });

    },

    update: async (req, res) => {
        let { body: data, params: { id } } = req;
        Borrow.getById(id)
            .then(borrow => borrow.update(data))
            .then(borrow => {
                if (data.book_code && Array.isArray(data.book_code)) {
                    borrow.books().sync(data.book_code)
                        .then(borrow => {
                            let { data } = borrow;
                            res.status(201).send(data);
                        }).catch(err => console.log(err));
                } else {
                    let { data } = borrow;
                    res.status(201).send(data)
                }
            })
            .catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });
    },

    returnee: async (req, res) => {
        let { params: { id } } = req;
        Borrow.update(id)
            .then(borrow => borrow.update({ returned_at: DB.raw("now()") }))
            .then(borrow => {
                let { data } = borrow;
                return res.send(data);
            })
            .catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });
    },

    destroy: async (req, res) => {
        let { params: { id } } = req;
        Borrow.getById(id)
            .then(borrow => borrow.destroy())
            .then(() => {
                res.sendStatus(204)
            })
            .catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });
    }

}