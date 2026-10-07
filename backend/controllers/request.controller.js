const RequestService = require('../services/request.service')
const UserService = require('../services/user.service')

class RequestController {

  async addRequest(req, res) {
    try {
      const { name, date, payment } = req.body
      const userId = req.userId
      
      if (!name || !date || !payment) {
        return res.status(400).json({ error: 'All fields are required' })
      }
      
      const request = await RequestService.createRequest(name, date, payment, 'Новая', userId)
      return res.status(201).json({ request })
      
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }
  
  async getMyRequests(req, res) {
    try {
      const userId = req.userId
      const requests = await RequestService.getUserRequests(userId)
      return res.status(200).json({ requests })
      
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  async getAllRequests(req, res) {
    try {
      const userId = req.userId
      const isAdmin = await UserService.getAdminUser(userId)
      if (isAdmin) {
        const requests = await RequestService.getAllRequests()
        return res.status(200).json({ requests })
      }
      
    } catch (error) {
       if (error.message === 'Insufficient access rights') {
        return res.status(404).json({ error: 'Недостаточно прав для доступа' })
      }
      console.log(error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }
  async changeStatusRequest(req, res) {
    try {
      const requestsId = req.params.id
      const userId = req.userId
      const { new_status } = req.body
      const isAdmin = await UserService.getAdminUser(userId)
      if (isAdmin) {
        const request = await RequestService.changeStatusRequest(requestsId, new_status)
        return res.status(200).json({ request })
      }
      
    } catch (error) {
       if (error.message === 'Insufficient access rights') {
        return res.status(404).json({ error: 'Недостаточно прав для доступа' })
      }
      console.log(error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }
  
  async deleteRequest(req, res) {
    try {
      const requestsId = req.params.id
      const userId = req.userId
      
      const result = await RequestService.deleteRequest(requestsId, userId)
      return res.status(200).json(result)
      
    } catch (error) {
      if (error.message === 'request not found') {
        return res.status(404).json({ error: 'request not found' })
      }
      console.log(error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}

module.exports = new RequestController()