import fs from "fs"
import path from "path"
import multer from "multer"
import { ErrorMsg } from "../../utils/constants/commonErrorMsg.constants"
import { CustomError } from "../../utils/errors/custom.error"
import { HttpResCode } from "../../utils/constants/httpResponseCode.utils"

const uploadDir = path.resolve("src/uploads")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true)
    } else {
      cb(new CustomError(ErrorMsg.ALLOWED_FILE_TYPE, HttpResCode.BAD_REQUEST))
    }
  },
})

export const imageUpload = upload.fields([
  { name: "files", maxCount: 10 },
  { name: "titles" },
  { name: "originalFileNames" },
  { name: "mimeTypes" },
  { name: "fileSizes" },
])

export const singleImageEditUpload = upload.fields([
  { name: "file", maxCount: 1 },
  { name: "title", maxCount: 1 },
  { name: "originalFileName", maxCount: 1 },
  { name: "mimeType", maxCount: 1 },
  { name: "fileSize", maxCount: 1 },
])
