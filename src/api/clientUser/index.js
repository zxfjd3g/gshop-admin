import request from '@/utils/request'

const api_name = '/admin/user'

export default {

  /* 
  获取客户搜索分页列表
  */
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },

  /* 
  锁定/取消锁定指定id用户
  */
  lock(id, status) {
    return request({
      url: `${api_name}/lock/${id}/${status}`,
      method: 'get'
    })
  },

  /* 
  获取指定id的用户详细信息
  */
  // show(id) {
  //   return request({
  //     url: `${api_name}/show/${id}`,
  //     method: 'get'
  //   })
  // }
}
