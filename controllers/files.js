import { upload } from '../helpers/multer.js'
import clientPromise from '../lib/mongodb.js'

export async function uploadFile(req, res) {
  const client = await clientPromise
  const filesCollection = client.db('files').collection('files')

  upload.single('image')(req, res, async (err) => {
    if (err) {
      console.log(err)
      return res.status(400).send({ message: err.message })
    }

    const response = await filesCollection.insertOne({
      name: req.body.name,
      description: req.body.description,
      originalName: req.file.originalname,
      path: req.file.path,
      contentType: req.file.mimetype,
      size: req.file.size,
    })

    console.log(response)
    return res.send({
      fileId: response.insertedId,
      message: 'File uploaded and saved to database successfully',
    })
  })
}
