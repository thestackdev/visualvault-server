import fs from 'fs'
import multer from 'multer'

export default function Upload(path) {
  return multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        fs.mkdirSync(path, { recursive: true })
        cb(null, path)
      },

      filename: function (req, file, cb) {
        cb(
          null,
          `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        )
      },
    }),
    limits: { fileSize: 10000000 },
  })
}
