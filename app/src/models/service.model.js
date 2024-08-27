import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
})

export default Service

