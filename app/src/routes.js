import { Router } from 'express'
import db from './models/index.js'
import { createMessage, getAllMessages, getMessageById, deleteMessage, updateMessage } from './controllers/message.controller.js'
import { createDefaultService, createService, getAllServices, getServiceById, deleteService, updateService } from './controllers/service.controller.js'

db.sequelize.sync({ force: false }).then(() => {
  createDefaultService(process.env.DEFAULT_SERVICES.split(','))
  console.log("Drop and re-sync db.")
})

const URL_HASH = process.env.API_HASH
const router = Router()

function validateHash(req, res, next) {
  const hash = req.query.hash
  if (hash === URL_HASH) {
    next()
  } else {
    res.status(401).json({ error: 'url inválida' })
  }
}

function ready(req, res, next) {
    res.status(200).json({'ready': true})
}

router.use('/ready', ready)
router.use(`/api/*`, validateHash)
router.get('/api/message/', getAllMessages)
router.get('/api/message/:id', getMessageById)
router.post('/api/message', createMessage)
router.put('/api/message/:id', updateMessage)
router.delete('/api/message/:id', deleteMessage)
router.get('/api/service',getAllServices) 
router.get('/api/service',getServiceById) 
router.post('/api/service', createService) 
router.put('/api/service', updateService) 
router.delete('/api/service/:id', deleteService) 

export default router
