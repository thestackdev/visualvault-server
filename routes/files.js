import { Router } from 'express'
import { deleteFile, getFiles, uploadFile } from '../controllers/files.js'

const router = Router()

router.get('/file', getFiles)
router.post('/file', uploadFile)
router.delete('/file', deleteFile)

export default router
