const Router = require('express')
const router = new Router()
const userController = require('../controllers/user.controller')
const requestController = require('../controllers/request.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', (req, res) => {
    res.status(200).json({message: 'logged out successfully'})
})

router.get('/profile', authMiddleware, userController.getUser)

router.post('/requests', authMiddleware, requestController.addRequest)
router.get('/requests', authMiddleware, requestController.getMyRequests)
router.get('/all_requests', authMiddleware, requestController.getAllRequests)
router.delete('/requests/:id', authMiddleware, requestController.deleteRequest)

router.post('/chahge_status/:id', authMiddleware, requestController.changeStatusRequest)

module.exports = router