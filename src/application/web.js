import express from 'express';
import publicRouter from '../route/public-api.js';
import errorMiddleware from '../middleware/error-middleware.js';
import userRouter from '../route/api.js';
import expressFileUpload from 'express-fileupload'
import path from "path"

const web = express();
web.use("/mechanic", express.static(path.resolve(__dirname, "../../storage/mechanic")))
web.use(express.json());
web.use(expressFileUpload())
web.use(publicRouter);
web.use(userRouter);
web.use(errorMiddleware)

export {
    web
}