const File = require('../models/fileModel');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const { encryptData, decryptData } = require('../services/encryptionService');

exports.uploadFile = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('No file was uploaded.', 400));
    }

    const { buffer, originalname, mimetype, size } = req.file;

    const encryptedData = encryptData(buffer);

    const newFile = await File.create({
        user: req.user._id,
        filename: originalname,
        encryptedData: encryptedData,
        mimetype: mimetype,
        size: size,
    });

    res.status(201).json({
        status: 'success',
        message: 'File encrypted and uploaded successfully.',
        data: {
            fileId: newFile._id,
            filename: newFile.filename
        }
    });
});

exports.getFiles = asyncHandler(async (req, res, next) => {
    const files = await File.find({ user: req.user._id })
        .select('-encryptedData -__v -user');

    res.status(200).json({
        status: 'success',
        count: files.length,
        data: {
            files
        }
    });
});

exports.downloadFile = asyncHandler(async (req, res, next) => {
    const { fileId } = req.params;

    const file = await File.findOne({ _id: fileId, user: req.user._id });

    if (!file) {
        return next(new AppError('File not found or you do not have permission.', 404));
    }

    const decryptedData = decryptData(file.encryptedData);

    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Length', decryptedData.length);

    res.status(200).send(decryptedData);
});

exports.deleteFile = asyncHandler(async (req, res, next) => {
    const { fileId } = req.params;

    const file = await File.findOneAndDelete({ _id: fileId, user: req.user._id });

    if (!file) {
        return next(new AppError('File not found or you do not have permission.', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
