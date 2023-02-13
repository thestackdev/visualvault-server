import { Router } from 'express'
import { deleteFile, uploadFile } from '../controllers/files.js'

const router = Router()

router.post('/file', uploadFile)
router.delete('/file', deleteFile)

export default router
