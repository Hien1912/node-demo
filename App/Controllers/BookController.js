const Book = require("../Model/Book");

module.exports = {
    index: async (req, res) => {
        let { query: { page, per_page } } = req;
        let query = { page: page ? +page : 1, per_page: per_page ? +per_page : 10 };

        Book.get(query)
            .then(books => res.send(books))
            .catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });
    },

    store: async (req, res) => {
        let { body: data } = req;
        Book.create(data)
            .then(book => {
                let { data } = book;
                res.status(201).send(data);
            })
            .catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });
    },

    show: async (req, res) => {
        let { params: { id } } = req;
        Book.getById(id)
            .then(book => {
                let { data } = book;
                res.status(201).send(data);
            }).catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });

    },

    update: async (req, res) => {
        let { body: data, params: { id } } = req;
        Book.getById(id)
            .then(book => book.update(data))
            .then(book => {
                let { data } = book;
                return res.send(data);
            })
            .catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });
    },

    destroy: async (req, res) => {
        let { params: { id } } = req;
        Book.getById(id)
            .then(book => book.destroy())
            .then(() => {
                res.sendStatus(204)
            })
            .catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });
    }

}