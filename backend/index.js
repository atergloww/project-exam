require('dotenv').config()
const express = require('express')
const sequelize = require('./db/db')
const cors = require('cors')
const userRouter = require('./routes/user.router')
const PORT = process.env.PORT || 5002
const app = express()


app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
)

app.use(express.json())
app.use('/api', userRouter)

const start = async() => {
    try {
        await sequelize.authenticate();
        await sequelize.sync()
        app.listen(PORT, () => console.log(`SERVER STARTED ON PORT ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
start();