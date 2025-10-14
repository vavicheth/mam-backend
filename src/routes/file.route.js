import express from 'express';
import {upload, uploads} from "../middlewares/multer.js";
import {deleteFileById, getFileById, uploadMultipleFile, uploadSingleFile} from "../controllers/file.controller.js";

const fileRoute = express.Router();

fileRoute.post("/upload",upload,uploadSingleFile);
fileRoute.post("/uploads",uploads,uploadMultipleFile);
fileRoute.get('/:id',getFileById);
fileRoute.delete("/:id",deleteFileById);

export default fileRoute;