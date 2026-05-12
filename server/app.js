import express from 'express'
import cors from 'cors'
import auditRouter from './routers/audit.router.js'
import leadsRouter from './routers/leads.router.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send("Server is running...")
})

app.use('/api/audit', auditRouter)
app.use('/api/leads', leadsRouter)

export default app