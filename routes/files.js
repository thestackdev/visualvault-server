import { Router } from 'express'
import { deleteFile, getFiles, uploadFile } from '../controllers/files.js'
import authorize from '../middleware/auth.js'

const router = Router()

router.get('/file', authorize, getFiles)
router.post('/file', authorize, uploadFile)
router.delete('/file', authorize, deleteFile)

export default router
