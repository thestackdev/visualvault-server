import fs from 'fs'
import { ObjectId } from 'mongodb'

import { upload } from '../helpers/multer.js'
import clientPromise from '../lib/mongodb.js'

const client = await clientPromise
const filesCollection = client.db('files').collection('files')

export async function getFiles(req, res) {
  const page = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.pageSize) || 10
  const offset = (page - 1) * pageSize

  const totalItems = await filesCollection.countDocuments()
  const totalPages = Math.ceil(totalItems / pageSize)

  const results = await filesCollection
    .find({ createdBy: req.token.sub })
    .skip(offset)
    .limit(pageSize)
    .toArray()

  return res.json({
    results,
    page,
    pageSize,
    totalItems,
    totalPages,
  })
}

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
      createdBy: req.token.sub,
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
    createdBy: req.token.sub,
  })

  fs.unlink(response.value.path, (err) => {
    if (err) {
      console.log(err)
      return res.status(400).send({ message: err.message })
    }
  })

  return res.send({ message: 'File deleted successfully' })
}
