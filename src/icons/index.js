import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

// 扫描指定目标下的所有文件
const req = require.context('./svg', false, /\.svg$/)
// 遍历扫描的所有文件路径
const requireAll = requireContext => requireContext.keys().forEach(path => {
   // 加载模块
  requireContext(path)
});
requireAll(req)