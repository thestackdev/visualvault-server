import express from 'express'
import filesRouter from './routes/files.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/public', express.static('public/uploads'))

app.use('/', filesRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
