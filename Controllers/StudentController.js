const Student = require("../Model/Student");
const { validationResult } = require("express-validator");
const fs = require("fs");

module.exports = {
    index: async (req, res) => {
        let { query } = req;
        let errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).send({ errors: errors.array() });

        return Student.get(query)
            .then(({ status, data }) => {
                res.status(status).send(data)
            }).catch(err => {
                // res.status(status).send(err);
                res.sendStatus(err);
            });
    },

    getTrashed: async (req, res) => {
        let { query } = req;
        let errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).send({ errors: errors.array() });

        return Student.getTrashed(query)
            .then(({ status, data }) => {
                res.status(status).send(data);
            }).catch(err => {
                res.sendStatus(err);
            });
    },

    store: async (req, res) => {
        let { body, file } = req;
        if (file) body.avatar = file.path;
        return Student.create(body)
            .then((id) => {
                res.sendStatus(201);
            }).catch(err => {
                res.sendStatus(err);
            });
    },

    show: async ({ params }, res) => {
        Student.getById(params)
            .then((student) => {
                res.status(200).send(student);
            }).catch(err => {
                res.sendStatus(err);
            });
    },

    update: async (req, res) => {
        let { body, file, params } = req;
        if (file) body.avatar = "images/" + file.filename;
        Student.getById(params).then(student => {
            student.update(body).then((std) => {
                if (file && student.data.avatar)
                    fs.unlink("public/" + student.data.avatar, err => console.log(err));
                res.send(std);
            }).catch(err => res.sendStatus(err));
        }).catch(err => res.sendStatus(err));
    },

    delete: async ({ params }, res) => {
        Student.getById(params).then(student => {
            student.delete().then(() => {
                res.sendStatus(204);
            }).catch(err => res.sendStatus(err));
        }).catch(err => res.sendStatus(err));
    },

    restore: async ({ params }, res) => {
        Student.getById(params).then(student => {
            student.restore().then((std) => {
                res.send(std);
            }).catch(err => res.sendStatus(err));
        }).catch(err => res.sendStatus(err));
    },

    destroy: async ({ params }, res) => {
        Student.getById(params).then(student => {
            student.destroy().then(() => {
                res.sendStatus(204);
            }).catch(err => res.sendStatus(err));
        }).catch(err => res.sendStatus(err));
    }
}