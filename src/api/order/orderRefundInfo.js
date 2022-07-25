import request from '@/utils/request'

const api_name = '/admin/order/orderRefundInfo'

export default {

  getPageList(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
    })
  },

  approval(data) {
    return request({
      url: `${api_name}/approval`,
      method: 'post',
      data
    })
  },

  recieve(id) {
    return request({
      url: `${api_name}/recieve/${id}`,
      method: 'get'
    })
  }
}

