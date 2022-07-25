import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control


import '@/filters'
import './plugins/elements'
import './plugins/chart' // 引入图表插件
import './mockServer' // 引入mock接口(用于得到数据可视化相关数据)
import '@/styles/echarts.css'

// 引入按钮级别权限控制的工具函数
import { hasBtnPermission } from './utils/permission'
// 引入包含所有接口请求函数模块的API对象
import * as API from '@/api'
import CommonCard from '@/views/dashboard/components/CommonCard.vue'

// 引入准备全局注册的组件
Vue.component(CommonCard.name, CommonCard)
import HintButton from '@/components/HintButton'
import CategorySelector from '@/components/CategorySelector'

// 注册全局组件
Vue.component('HintButton', HintButton)
Vue.component('CategorySelector', CategorySelector)

// 挂载到Vue原型对象上, 以便组件中直接可见
Vue.prototype.$hasBP = hasBtnPermission
Vue.prototype.$API = API
Vue.prototype.$BASE_API = process.env.VUE_APP_BASE_API

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})