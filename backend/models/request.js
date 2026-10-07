const { DataTypes } = require('sequelize')
const sequelize = require('../db/db')

const Request = sequelize.define('request', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    date: {type: DataTypes.DATEONLY},
    payment: {type: DataTypes.STRING},
    status: {type: DataTypes.STRING},
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
    }
})

module.exports = { Request }