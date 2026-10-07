const { User } = require('../models/user');
const argon2 = require('argon2')

class UserService {
    async getOneUser(id) {
        const user = await User.findOne({where: { id }})
        if (!user) {
            throw new Error('user not found')
        }
        return user
    }

    async getAdminUser(id) {
        const user = await User.findOne({where: { id }})
        if (!user) {
            throw new Error('user not found')
        }
        if (user.role === 'admin') {
            return user
        }
        throw new Error('Insufficient access rights')
    }


    async register(name, login, email, password, phone, role) {
        const existingUserEmail = await User.findOne({where: { email }})
        if (!existingUserEmail) {
            const existingUserLogin = await User.findOne({where: { login }})
            if (!existingUserLogin) {
                const hashedPassword = await argon2.hash(password)
                const user = await User.create({name, login, email, password: hashedPassword, phone, role})
                return user
            }
            throw new Error('user with this login already exists')
        }
        throw new Error('user with this email already exists')
    }

    async authenticate(login, password) {
        const user = await User.findOne({where: { login }})
        if (!user) {
            throw new Error('user not found')
        }

        const isValidPassword = await argon2.verify(user.password, password)
        if (!isValidPassword) {
            throw new Error('invalid password')
        }

        return user
    }

}

module.exports = new UserService()