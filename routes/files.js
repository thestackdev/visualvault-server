import { Router } from 'express'
import { uploadFile } from '../controllers/files.js'

const router = Router()

router.post('/upload', uploadFile)

export default router
