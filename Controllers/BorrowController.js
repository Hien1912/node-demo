const { DB } = require("../configs/database");

module.exports = {
    index: async (req, res) => {
        DB('borrows').select()
            .then((borrows) => {
                if (!borrows) res.sendStatus(204)
                res.status(200).send(borrows);
            }).catch((err) => {
                res.sendStatus(500);
            });
    },

    store: async ({ body }, res) => {
        DB('borrows').insert(body)
            .then((id) => {
                return DB('borrows').where('id', id).first();
            }).then(borrow => {
                res.status(201).send(borrow);
            }).catch((err) => {
                res.sendStatus(500);
            });
    },

    show: async ({ params }, res) => {
        DB('borrows').select().where(params).first()
            .then((borrow) => {
                if (!borrow) res.sendStatus(404);
                res.status(200).send(borrow);
            }).catch((err) => {
                res.sendStatus(500);
            });
    },

    update: async ({ body, params }, res) => {
        DB('borrows').where(params).first()
            .then((borrow) => {
                if (!borrow) res.sendStatus(404);
                return DB('borrows').where(params).update(body);
            }).then(() => {
                return DB('borrows').where(params).first();
            }).then((borrow) => {
                res.status(200).send(borrow);
            }).catch((err) => {
                res.sendStatus(500);
            });
    },

    delete: async ({ params }, res) => {
        DB('borrows').where(params).first()
            .then((borrow) => {
                if (!borrow) res.sendStatus(404);
                return DB('borrows').where(params).del();
            }).then(() => {
                res.sendStatus(204);
            }).catch((err) => {
                res.sendStatus(404);
            });
    }
}