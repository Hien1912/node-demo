const multer = require('multer');
// const uploadAvatar = multer({ dest: "public/images" });

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + "." + file.originalname.split(".")[1])
    }
})

const uploadAvatar = multer({ storage: storage })
module.exports = uploadAvatar;