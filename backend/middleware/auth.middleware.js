const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]

    if (!token) {
        //доступ запрещен
        return res.status(403).json({ message: 'no token provided' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            //неавторизован
            return res.status(401).json({ message: 'unauthorized' })
            
        }

        req.userId = decoded.id
        next();
    })
}

module.exports = authMiddleware