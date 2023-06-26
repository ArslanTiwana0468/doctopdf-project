import { Request, Response } from "express";
import upload from "../config/multerconfig";
import libre from "libreoffice-convert";
import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";
export async function landingPage(req: Request, res: Response): Promise<void> {
  res.render("index", { success: false, error: null, loading: false });
}

export async function convertDocxToPdf(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.file) {
    res.render("index", {
      error: "No file uploaded",
      success: false,
      loading: false,
    });
    return;
  }

  const inputPath = req.file.path;
  const { name, ext } = path.parse(req.file.originalname);
  const timestamp = Date.now();
  const outputFilename = `${name}_${timestamp}.pdf`;
  const outputPath = path.join(__dirname, outputFilename);

  try {
    const docData = await fs.promises.readFile(inputPath);
    await libre.convert(docData, ".pdf", undefined, (err, result) => {
      if (err) {
        console.error(err);
        res.render("index", {
          error: "Conversion failed",
          success: false,
          loading: false,
        });
        return;
      }

      fs.writeFileSync(outputPath, result);
      fs.unlinkSync(inputPath);

      res.render("index", {
        success: true,
        error: null,
        outputFilename,
        loading: false,
        downloadLink: `/download?filename=${outputFilename}`,
      });
    });
  } catch (error) {
    console.error(error);
    res.render("index", {
      error: "Conversion failed",
      success: false,
      loading: false,
    });
  }
}

export async function convertPdfToDocx(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.file) {
    res.render("index", {
      error: "No file uploaded",
      success: false,
      loading: false,
    });
    return;
  }

  const inputPath = req.file.path;
  const { name, ext } = path.parse(req.file.originalname);
  const timestamp = Date.now();
  const outputFilename = `${name}_${timestamp}.docx`;
  const outputPath = path.join(__dirname, outputFilename);

  try {
    const pdfData = await fs.promises.readFile(inputPath);
    const pdfDoc = await PDFDocument.load(pdfData);

    const docxBytes = await pdfDoc.saveAsBase64({ dataUri: false });

    fs.writeFileSync(outputPath, Buffer.from(docxBytes, "base64"));
    fs.unlinkSync(inputPath);

    res.render("index", {
      success: true,
      error: null,
      outputFilename,
      downloadLink: `/download?filename=${outputFilename}`,
      loading: false,
    });
  } catch (error) {
    console.error(error);
    res.render("index", {
      error: "Conversion failed",
      success: false,
      loading: false,
    });
  }
}

export async function download(req: Request, res: Response): Promise<any> {
  const outputFilename: any = req.query.filename;
  const outputPath = path.join(__dirname, outputFilename);
  res.download(outputPath, outputFilename, (err) => {
    if (err) {
      console.error(err);
      res.redirect("/");
    }
    fs.unlinkSync(outputPath);
  });
}
