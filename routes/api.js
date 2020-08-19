const Router = require('express').Router();
const StudentController = require("../App/Controllers/StudentController");
const StudentUploadAvatar = require("../App/Services/StudentUploadAvatar");


Router.route("/students")
    .get(StudentController.index)
    .post(StudentUploadAvatar.single('avatar'), StudentController.store)

Router.get("/students/t", StudentController.getTrashed);

Router.route("/students/:id")
    .get(StudentController.show)
    .put(StudentUploadAvatar.single('avatar'), StudentController.update)
    .delete(StudentController.delete)

Router.route("/students/:id/t")
    .put(StudentController.restore)
    .delete(StudentController.destroy)


module.exports = Router;
