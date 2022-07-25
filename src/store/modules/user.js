import {login as loginAPI} from '@/api'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import {constantRoutes, allAsyncRoutes, anyRoute} from '@/router/routes'
import router from '@/router'
import cloneDeep from 'lodash/cloneDeep'
/**
 * 递归过滤异步路由表，返回符合用户菜单权限的路由表
 * @param asyncRoutes
 * @param routeNames
 */
 function filterAsyncRoutes(allAsyncRoutes, routeNames) {
  return allAsyncRoutes.filter(route => {

    // 如果route的name在routeNames中没有, 直接过滤掉
    if (routeNames.indexOf(route.name)===-1) return false

    // 如果当前route还有子路由(也就是有children), 需要对子路由也进行权限过滤
    if (route.children && route.children.length>0) {
      // 递归调用, 对子路由进行过滤产生子路由的列表, 并替换掉原本的children
      route.children = filterAsyncRoutes(route.children, routeNames)
    }
    return true
  })
}

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    
    roles: [], 
    buttons: [],
    routes: [], // 用于显示导航菜单的路由数组,包括了constantRoutes和asyncRoutes
  }
}

const state = getDefaultState()

const mutations = {
  SET_USER: (state, userInfo) => {
    state.name = userInfo.name // 用户名
    state.avatar = userInfo.avatar // 头像
    state.roles = userInfo.roles // 角色列表
    state.buttons = userInfo.buttons // 按钮权限列表
  },

  SET_TOKEN (state, token) {
    state.token = token
  },

  RESET_USER (state) {
    Object.assign(state, getDefaultState())
  },

  SET_ROUTES: (state, asyncRoutes) => {
    // 保存异步路由
    // state.asyncRoutes = asyncRoutes
    // 合并常量路由,异步路由与备选路由, 并保存
    state.routes = constantRoutes.concat(asyncRoutes)
    // 将当前用户的异步权限路由和备选路由添加到路由器
    router.addRoutes([...asyncRoutes, anyRoute])
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      loginAPI.login(username, password)
        .then(result => {
          const { data } = result
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  async getInfo({ commit, state }) {
    const {data} = await loginAPI.getInfo()
    // const {name, avatar, routes, buttons, roles} = data
    commit('SET_USER', data)
    // commit('SET_ROUTES', filterAsyncRoutes(allAsyncRoutes, data.routes))
    commit('SET_ROUTES', filterAsyncRoutes(cloneDeep(allAsyncRoutes), data.routes))
  },

  /* 
  重置用户信息
  */
  async resetUser({ commit, state }) {
    // 如果当前是登陆的, 请求退出登陆
    if (state.name) {
      await loginAPI.logout()
    }
    // 删除local中保存的token
    removeToken()
    // 重置路由
    resetRouter()
    // 提交重置用户信息的mutation
    commit('RESET_USER')
  },
}

export default {
  // 标识外部触发当前模块的action/mutation调用时, 需要指定当前模块的标识名称
  // 例子: $store.dispatch('user/getInfo')
  // 有什么用? 避免多个vuex子模块的action/mutation的同名冲突
  namespaced: true, 
  state,
  mutations,
  actions
}