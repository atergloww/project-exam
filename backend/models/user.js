const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../db/db')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    login: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING},
    phone: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING}
})

module.exports = {User}