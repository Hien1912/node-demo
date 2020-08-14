const StudentRequest = require("../Request/StudentRequest");
const Book = require("../Model/Book");

module.exports = {
    index: async ({ query }, res) => {
        Book.get(query)
            .then(({ status, data }) => {
                res.status(status).send(data);
            }).catch(({ status, err }) => {
                res.status(status).send(err);
            });

    },

    store: async ({ body }, res) => {
        Book.create(body).then(({ status, data }) => {
            res.status(status).send(data);
        }).catch(({ status, err }) => {
            res.status(status).send(err);
        });
    },

    show: async ({ params }, res) => {
        Book.getById(params).then(({ status, data }) => {
            res.status(status).send(data);
        }).catch(({ status, err }) => {
            res.status(status).send(err);
        });
    },

    update: async ({ body, params }, res) => {
        Book.update(body, params).then(({ status, data }) => {
            res.status(status).send(data);
        }).catch(({ status, err }) => {
            res.status(status).send(err);
        });
    },


    destroy: async ({ params }, res) => {
        Book.destroy(params).then(({ status, data }) => {
            res.status(status).send(data);
        }).catch(({ status, err }) => {
            res.send(status).send(err);
        });
    }
}