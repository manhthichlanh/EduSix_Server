import { errorCode } from '../../utils/util.helper.js';

const errorHandlerMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    console.log('errrrrr--------', err);

    if (err === 'Error: Images Only!') {
        return res.status(400).json({
            success: false,
            error: err,
            code: errorCode.InvalidData
        });
    } else if (err.code === 'LIMIT_FILE_SIZE' || err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            success: false,
            error: err,
            code: errorCode.InvalidData
        });
    } else if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(403).json({
            success: false,
            error: getTranslate('Data Exists', req.user.language), 
            code: errorCode.InvalidData,
        });
    } 
    res.status(err.statusCode).json({
        success: false,
        error: err.message,
        stack: err.stack,
        code: errorCode.Exception
    });
};

export default errorHandlerMiddleware;
