import fs from 'fs'
import { ObjectId } from 'mongodb'

import Upload from '../helpers/multer.js'
import clientPromise from '../lib/mongodb.js'

const client = await clientPromise
const objectCollection = client.db('files').collection('objects')

export async function getObjects(req, res) {
  const page = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.pageSize) || 10
  const offset = (page - 1) * pageSize

  const totalItems = await objectCollection
    .find({ createdBy: req.token?.sub })
    .count()
  const totalPages = Math.ceil(totalItems / pageSize)

  const results = await objectCollection
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

export async function uploadObject(req, res) {
  console.log(req.query)
  const path = `public/users/${req.token.sub}/uploads/${req.body.dir}`
  console.log(path)
  Upload(path).single('image')(req, res, async (err) => {
    if (err) {
      console.log(err)
      return res.status(400).send({ message: err.message })
    }

    const response = await objectCollection.insertOne({
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

export async function deleteObject(req, res) {
  if (!req.query.id) {
    return res.status(400).send({ message: 'File ID is missing' })
  }

  const response = await objectCollection.findOneAndDelete({
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
