import { Router } from 'express'
import { deleteObject, getObjects, uploadObject } from '../controllers/files.js'
import authorize from '../middleware/auth.js'

const router = Router()

router.get('/object', authorize, getObjects)
router.post('/object', authorize, uploadObject)
router.delete('/object', authorize, deleteObject)

export default router
