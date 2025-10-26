const multer = require('multer');
const AppError = require('../utils/appError');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('text/') || file.mimetype === 'application/pdf' || file.mimetype === 'application/octet-stream') {
        cb(null, true);
    } else {
        cb(new AppError('Invalid file type. Only text, PDF, or binary files are allowed.', 400), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20 MB file size limit
    }
});

exports.uploadFile = upload.single('file');

exports.checkFileExists = (req, res, next) => {
    if (!req.file) {
        return next(new AppError('No file uploaded. Please attach a file to your request.', 400));
    }
    next();
};
