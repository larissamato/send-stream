import sequelize from '../config/database.js'
import Sequelize from 'sequelize'
import Message from './message.model.js'
import Service from './service.model.js'
import MessageService from './messageService.model.js'

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.Message = Message 
db.Service = Service 
db.MessageService = MessageService 

db.Message.belongsToMany(db.Service, {
  through: db.MessageService,
  as: 'services',
  foreignKey: 'id_message',
})

db.Service.belongsToMany(db.Message, {
  through: db.MessageService,
  as: 'messages',
  foreignKey: 'id_service',
})

export default db
