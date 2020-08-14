const Router = require('express').Router();
const StudentRequest = require("../Request/StudentRequest");
const StudentController = require('../controllers/StudentController');
const BookController = require('../Controllers/BookController');
const uploadAvatar = require('../Services/uploadAvatar');



Router.route("/students/")
    .get(StudentRequest.index, StudentController.index)
    .post(uploadAvatar.single("avatar"), StudentController.store)

Router.get("/students/t", StudentController.getTrashed)

Router.route("/students/:id")
    .get(StudentController.show)
    .put(uploadAvatar.single("avatar"), StudentController.update)
    .delete(StudentController.delete)

Router.route("/students/:id/t")
    .put(StudentController.restore)
    .delete(StudentController.destroy)

Router.route("/books")
    .get(BookController.index)
    .post(BookController.store);

Router.route("/books/:id")
    .get(BookController.show)
    .put(BookController.update)
    .delete(BookController.destroy);

module.exports = Router;
