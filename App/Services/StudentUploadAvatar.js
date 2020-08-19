const multer = require("multer")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/students/avatars');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + "." + file.mimetype.split("/").slice(1).join();
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

module.exports = multer({ storage: storage })