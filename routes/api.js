const Router = require('express').Router();
const StudentController = require("../App/Controllers/StudentController");
const StudentUploadAvatar = require("../App/Services/StudentUploadAvatar");
const BookController = require('../App/Controllers/BookController');
const BorrowController = require('../App/Controllers/BorrowController');
const PaginateRequest = require('../App/Requests/PaginateRequest');
const BookRequest = require('../App/Requests/BookRequest');
const checkValidate = require('../App/Requests/CheckValidate');

/**
 * ----- Router books -----
 */
Router
    .route("/books")
    .get(PaginateRequest, checkValidate, BookController.index)
    .post(BookRequest.store, checkValidate, BookController.store)

Router
    .route("/books/:id")
    .get(BookController.show)
    .put(BookController.update)
    .delete(BookController.destroy)


/**
* ----- Router students -----
*/
Router
    .route("/students")
    .get(PaginateRequest, StudentController.index)
    .post(StudentUploadAvatar.single('avatar'), StudentController.store)

Router.get("/students/t", StudentController.getTrashed);

Router
    .route("/students/:id")
    .get(StudentController.show)
    .put(StudentUploadAvatar.single('avatar'), StudentController.update)
    .delete(StudentController.delete)

Router
    .route("/students/:id/t")
    .put(StudentController.restore)
    .delete(StudentController.destroy)

Router
    .route("/borrows")
    .get(PaginateRequest, BorrowController.index)
    .post(BorrowController.store)

/**
 * ----- Router borrows -----
 */

Router.get("/borrows/r", BorrowController.getReturned)
Router.get("/borrows/d", BorrowController.getDue)

Router.route("/borrows/:id/r").put(BorrowController.returnee);

Router
    .route("/borrows/:id")
    .get(BorrowController.show)
    .put(BorrowController.update)
    .delete(BorrowController.destroy)


module.exports = Router;
