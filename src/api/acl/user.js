/* 
后台用户管理相关的API请求函数
*/
import request from '@/utils/request'

const api_name = '/admin/acl/user'

export default {

  /* 
  获取后台用户分页列表(带搜索)
  searchObj: {username, nickName}
  */
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      // method: 'get',
      params: searchObj
    })
  },

  /* 
  根据ID获取某个后台用户
  */
  getById(id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: 'get'
    })
  },

  /* 
  保存一个新的后台用户
  user: {username, nickName, password}
  */
  add(user) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: user
    })
  },

  /* 
  更新一个后台用户
  */
  update(user) {
    return request({
      url: `${api_name}/update`,
      method: 'put',
      data: user
    })
  },

  /* 
  获取某个用户的所有角色
  */
  getRoles(userId) {
    return request({
      url: `${api_name}/toAssign/${userId}`,
      method: 'get'
    })
  },

  /* 
  给某个用户分配角色
  roleId的结构: 字符串, 'rId1,rId2,rId3'
  */
  assignRoles(userId, roleId) {
    return request({
      url: `${api_name}/doAssign`,
      method: 'post',
      params: {
        userId,
        roleId
      }
    })
  },

  /* 
  删除某个用户
  */
  removeById(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },

  /* 
  批量删除多个用户
  ids的结构: ids是包含n个id的数组
  */
  removeUsers(ids) {
    return request({
      url: `${api_name}/batchRemove`,
      method: 'delete',
      data: ids    // [1, 2, 3]
    })
  }
}

/* 
axios/request

axios()
  axios(url): 发送get请求的， 如果需要携带参数， 只能拼接在url上
  axios({    // 发送任意类型请求
    url,  // 如果有params参数， 只能拼接在url中
    method,
    params: {},  // query参数
    data: string/object/array    // 请求体参数
    // {name: tom, age: 12}  '{name: tom, age: 12}' name=tom&age=12   [1, 2, 3]   '1,2,3'
  })
axios.xxx()   // get/post/put/delete
  get(url, options)    {params: {id: 12}}
  delete(url, options)  {params: {id: 12}, data: {}}
  post(url, data, options)  {params: {id: 12}}
  put(url, data, options)   {params: {id: 12}}
*/