const Student = require("../Model/Student");
const fs = require("fs");
const DB = require("../../configs/database");

module.exports = {
    index: async (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        let { query } = req;
        Student.get(query)
            .then(students => res.send(students))
            .catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });
    },

    store: async (req, res) => {
        let { body: data, file } = req;
        if (file) data.avatar = file.destination.split("/").slice(1).join("/") + "/" + file.filename;

        Student.create(data)
            .then(student => {
                let { data } = student;
                res.status(201).send(data);
            })
            .catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });
    },

    show: async (req, res) => {
        let { params: { id } } = req;
        Student.getById(id)
            .then(student => {
                let { data } = student;
                res.status(201).send(data);
            }).catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });

    },

    update: async (req, res) => {
        let { body: data, file, params: { id } } = req;
        if (file) data.avatar = file.destination.split("/").slice(1).join("/") + "/" + file.filename;
        let oldavatar;
        Student.getById(id)
            .then(student => {
                if (student.data.deleted_at != null)
                    return res.sendStatus(404);

                oldavatar = student.data.avatar;
                return student.update(data)
            })
            .then(student => {
                let { data } = student;
                if (file && oldavatar && oldavatar.startsWith("images"))
                    fs.unlink("public/" + oldavatar, (err => console.log(err)));

                return res.send(data);

            })
            .catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });
    },

    delete: async (req, res) => {
        let { params: { id } } = req;
        Student.getById(id)
            .then(student => {
                if (student.data.deleted_at != null)
                    return res.sendStatus(404);
                return student.update({ deleted_at: DB.raw("now()") })
            })
            .then(student => {
                // let { data } = student;
                // res.send(data);

                return res.sendStatus(204);

            })
            .catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });
    },

    restore: async (req, res) => {
        let { params: { id } } = req;
        Student.getById(id)
            .then(student => {
                if (student.data.deleted_at == null)
                    return res.sendStatus(404);

                return student.update({ deleted_at: null })
            })
            .then(student => {
                let { data } = student;
                res.send(data);

            })
            .catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });
    },

    destroy: async (req, res) => {
        let { params: { id } } = req;
        let avatar;
        Student.getById(id)
            .then(student => {
                avatar = student.data.avatar;
                return student.destroy();
            })
            .then(() => {
                if (avatar && avatar.startsWith("images"))
                    fs.unlink("public/" + oldavatar, (err => console.log(err)));

                res.sendStatus(204)
            })
            .catch(err => {
                console.log(err.msg);
                res.sendStatus(err.code);
            });
    },

    getTrashed: async (req, res) => {
        Student.getTrashed()
            .then(students => res.send(students))
            .catch(err => res.sendStatus(500));
    },

}