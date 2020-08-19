const Book = require("../Model/Book");
const DB = require("../../configs/database");

module.exports = {
    index: async (req, res) => {
        let { query } = req;
        Book.get(query)
            .then(books => res.send(books))
            .catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });
    },

    store: async (req, res) => {
        let { body: data, file } = req;
        Book.create(data)
            .then(book => res.status(201).send(book))
            .catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });
    },

    show: async (req, res) => {
        let { params: { id } } = req;
        Book.getById(id)
            .then(book => res.send(book.data)).catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });

    },

    update: async (req, res) => {
        let { body: data, file, params: { id } } = req;
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
        let avatar;
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