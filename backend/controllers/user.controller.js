const UserService = require('../services/user.service')
const jwt = require('jsonwebtoken')

class UserController {
    async getUser(req, res) {
        try {
            const id = req.userId
            const user = await UserService.getOneUser(id)
            return res.status(201).json({ message: 'protected profile route', user: user })
        }
        catch (error) {
            if (error.message === 'user not found') {
                return res.status(400).json({ error: 'Пользователь не найден' })
            }

            res.status(400).json({error: error.message})
        }
    }

    async register(req, res) {
        try {
            const { name, login, email, password, phone } = req.body;
            const user = await UserService.register(name, login, email, password, phone, 'user')
            return res.status(201).json({ user })
        } catch (error) {
            if (error.message === 'user with this email already exists') {
                return res.status(400).json({error: 'Пользователь с таким email уже зарегистрирован'})
            }
            if (error.message === 'user with this login already exists') {
                return res.status(400).json({error: 'Пользователь с таким логином уже зарегистрирован'})
            }

            res.status(400).json({error: error.message})
        }
    }

    async login(req, res) {
        try {
            const { login, password } = req.body;
            const user = await UserService.authenticate(login, password)
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '10h' })
            return res.status(201).json({ user: user, token: token })
        } catch (error) {
            if (error.message === 'user not found') {
                return res.status(400).json({ error: 'Пользователь с таким логином не найден' })
            }
            if (error.message === 'invalid password') {
                return res.status(400).json({ error: 'Неверный пароль' })
            }

            res.status(400).json({error: error.message})
        }
    }

}

module.exports = new UserController();