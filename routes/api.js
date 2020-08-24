const Router = require('express').Router();
const StudentController = require("../App/Controllers/StudentController");
const StudentUploadAvatar = require("../App/Services/StudentUploadAvatar");
const BookController = require('../App/Controllers/BookController');
const BorrowController = require('../App/Controllers/BorrowController');
const PaginateRequest = require('../App/Requests/PaginateRequest');
const BookRequest = require('../App/Requests/BookRequest');
const checkValidate = require('../App/Requests/CheckValidate');
const StudentRequest = require('../App/Requests/StudentRequest');
const BorowRequest = require('../App/Requests/BorrowRequest');

/**
 * ----- Router books -----
 */
Router
    .route("/books")
    .get(
        PaginateRequest,
        checkValidate,
        BookController.index
    )
    .post(
        BookRequest.store,
        checkValidate,
        BookController.store
    )

Router
    .route("/books/:id")
    .get(BookController.show)
    .put(
        BookRequest.update,
        BookRequest.checkCodeUpdate,
        checkValidate,
        BookController.update
    )
    .delete(BookController.destroy)

/**
* ----- Router students -----
*/
Router
    .route("/students")
    .get(
        PaginateRequest,
        checkValidate,
        StudentController.index
    )
    .post(
        StudentUploadAvatar.single('avatar'),
        StudentRequest.fileStore,
        StudentRequest.store,
        checkValidate,
        StudentController.store
    )

Router.get("/students/t", StudentController.getTrashed);

Router
    .route("/students/:id")
    .get(StudentController.show)
    .put(
        StudentUploadAvatar.single('avatar'),
        StudentRequest.fileUpdate,
        StudentRequest.update,
        StudentRequest.checkCodeUpdate,
        checkValidate,
        StudentController.update
    )
    .delete(StudentController.delete)

Router
    .route("/students/:id/t")
    .put(StudentController.restore)
    .delete(StudentController.destroy)

/**
 * ----- Router borrows -----
 */
Router
    .route("/borrows")
    .get(
        PaginateRequest,
        checkValidate,
        BorrowController.index
    )
    .post(
        BorowRequest.store,
        checkValidate,
        BorrowController.store
    )

Router.get("/borrows/r",
    PaginateRequest,
    checkValidate,
    BorrowController.getReturned
)

Router.get("/borrows/d",
    PaginateRequest,
    checkValidate,
    BorrowController.getDue
)

Router.route("/borrows/:id/r").put(BorrowController.returnee);

Router
    .route("/borrows/:id")
    .get(BorrowController.show)
    .put(
        BorowRequest.update,
        checkValidate,
        BorrowController.update
    )
    .delete(BorrowController.destroy)


module.exports = Router;
