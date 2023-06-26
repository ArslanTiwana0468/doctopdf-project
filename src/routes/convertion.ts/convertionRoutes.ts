import Express from "express";
import upload from "../../config/multerconfig";

import {
  landingPage,
  convertDocxToPdf,
  convertPdfToDocx,
  download,
} from "../../Controller/convertion";
const route = Express.Router();
route.get("/", landingPage);
route.post("/convert-docx-to-pdf", upload.single("docxFile"), convertDocxToPdf);
route.post("/convert-pdf-to-docx", upload.single("pdfFile"), convertPdfToDocx);
route.get("/download", download);

export default route;
