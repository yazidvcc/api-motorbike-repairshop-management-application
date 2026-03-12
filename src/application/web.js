import express from 'express';
import cookieParser from 'cookie-parser';
import publicRouter from '../route/public-api.js';
import errorMiddleware from '../middleware/error-middleware.js';
import userRouter from '../route/api.js';
import expressFileUpload from 'express-fileupload'

const web = express();
web.use(express.json());
web.use(cookieParser());
web.use(expressFileUpload())
web.use(publicRouter);
web.use(userRouter);
web.use(errorMiddleware)

export {
    web
}