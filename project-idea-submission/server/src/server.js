import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import { connectDB } from './config/db.js'
import ideaRoutes from './routes/idea.routes.js'

dotenv.config()

const app = express()
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use('/uploads', express.static(path.join(process.cwd(), 'server', 'uploads')))

app.use(cors({ origin: process.env.ALLOWED_ORIGIN?.split(',') || '*' }))

app.use('/api', ideaRoutes)

app.get('/api/health', (req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI

connectDB(MONGODB_URI).then(() => {
  app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`))
}).catch(err => {
  console.error('MongoDB connection error:', err)
  process.exit(1)
})
