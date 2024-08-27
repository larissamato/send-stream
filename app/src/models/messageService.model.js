import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const MessageService = sequelize.define('MessageService', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  send: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  channels: {
    type: DataTypes.TEXT,
  },
})

export default MessageService

