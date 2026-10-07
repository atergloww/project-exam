const { Request } = require('../models/request')

class RequestService {
  async createRequest(name, date, payment, status, userId) {
    const request = await Request.create({
      name,
      date,
      payment,
      status,
      userId
    })
    return request
  }

  async getUserRequests(userId) {
    const requests = await Request.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    })
    return requests
  }

  async getAllRequests() {
    const requests = await Request.findAll()
    return requests
  }

  async changeStatusRequest(requestId, newStatus) {
    const request = await Request.findOne({
      where: { id: requestId }
    })

    if (!request) {
      throw new Error('request not found')
    }

    request.status = newStatus
    await request.save()

    return request
  }

  async deleteRequest(requestId, userId) {
    const request = await Request.findOne({
      where: { id: requestId, userId }
    })
    
    if (!request) {
      throw new Error('request not found')
    }
    
    await request.destroy()
    return { message: 'request deleted' }
  }
}

module.exports = new RequestService()