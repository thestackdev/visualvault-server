import fs from 'fs'
import { ObjectId } from 'mongodb'
import { upload } from '../helpers/multer.js'
import clientPromise from '../lib/mongodb.js'

const client = await clientPromise
const filesCollection = client.db('files').collection('files')

export async function uploadFile(req, res) {
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

    return res.send({
      fileId: response.insertedId,
      message: 'File uploaded and saved to database successfully',
    })
  })
}

export async function deleteFile(req, res) {
  if (!req.query.id) {
    return res.status(400).send({ message: 'File ID is missing' })
  }

  const response = await filesCollection.findOneAndDelete({
    _id: new ObjectId(req.query.id),
  })

  fs.unlink(response.value.path, (err) => {
    if (err) {
      console.log(err)
      return res.status(400).send({ message: err.message })
    }
  })

  return res.send({ message: 'File deleted successfully' })
}
