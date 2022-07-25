import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 水平进度条提示: 在跳转路由时使用
import 'nprogress/nprogress.css' // 水平进度条样式
import getPageTitle from '@/utils/get-page-title' // 获取应用头部标题的函数

NProgress.configure({ showSpinner: false }) // 配置NProgress: 不显示右侧旋转进度条

// 不用进行token检查的白名单路径数组
const whiteList = ['/login']

// 注册全局前置守卫: 在路由准备跳转前执行
router.beforeEach(async(to, from, next) => {
  
  // 在显示进度条
  NProgress.start()

  // 设置整个页面的标题
  document.title = getPageTitle(to.meta.title)

  // 获取cookie中保存的token
  const token = store.getters.token
  // 如果token存在(已经登陆或前面登陆过)
  if (token) {
    // 如果请求的是登陆路由
    if (to.path === '/login') {
      // 直接跳转到根路由, 并完成进度条
      next({ path: '/' })
      NProgress.done()
    } else { // 请求的不是登陆路由
      // 是否已经登陆
      const hasLogin = !!store.getters.name
      // 如果已经登陆直接放行
      if (hasLogin) {
        next()
      } else { // 如果还没有登陆
        try {
          // 异步请求获取用户信息(包含权限数据) ==> 动态注册用户的权限路由 => 当次跳转不可见
          await store.dispatch('user/getInfo')
          // 重新跳转去目标路由
          // next()  // 有问题   刷新会白屏  直接放行会看不到动态添加的异步路由
          // next(to.path) // 重新跳转去目标路由, 能看到动态添加的异步路由, 但会丢失参数
          next({...to}) // 重新跳转去目标路由, 能看到动态添加的异步路由, 且不会丢失参数
          NProgress.done() // 结束进度条

        } catch (error) { // 如果请求处理过程中出错
          // 重置用户信息
          await store.dispatch('user/resetUser')
          // 提示错误信息
          Message.error(error || 'Has Error')
          // 跳转到登陆页面, 并携带原本要跳转的路由路径, 用于登陆成功后跳转
          next(`/login?redirect=${to.path}`)
          // 完成进度条
          NProgress.done()
        }
      }
    }
  } else { // 没有token
    // 如果目标路径在白名单中(是不需要token的路径)
    if (whiteList.indexOf(to.path) !== -1) {
      // 放行
      next()
    } else {
      // 如果没在白名单中, 跳转到登陆路由携带原目标路径
      next(`/login?redirect=${to.path}`)
      // 完成进度条  当次跳转中断了, 要进行一个新的跳转了
      NProgress.done()
    }
  }
})

// 注册全局后置守卫: 在路由跳转完成后执行
router.afterEach(() => {
  // console.log('afterEnter callback()')
  // 完成(隐藏)进度条显示
  NProgress.done()
})
