import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { createIdea, listIdeas, updateIdea, deleteIdea, stats } from '../controllers/idea.controller.js'
import { validate } from '../middleware/validate.js'
import { ideaCreateSchema, ideaUpdateSchema } from '../validators/idea.schema.js'

const router = Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), 'server', 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_')
    cb(null, `${base}_${Date.now()}${ext}`)
  }
})
const upload = multer({ storage })

router.get('/ideas', listIdeas)
router.get('/ideas/stats', stats)
router.post('/ideas', upload.single('attachment'), validate(ideaCreateSchema), createIdea)
router.put('/ideas/:id', validate(ideaUpdateSchema), updateIdea)
router.delete('/ideas/:id', deleteIdea)

export default router
