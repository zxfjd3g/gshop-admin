/* 
自定义过滤器
*/
import Vue from 'vue'

/* 
第三位加一个逗号
*/
function formatNumber(value) {
  if (!value) return ''
  return `${value}`.replace(/(\d{3})(?=\d)/g, '$1,')
}

/* 
数值格式化
*/
Vue.filter('numberFormat', formatNumber)

/* 
人民币格式化
*/
Vue.filter('moneyFormat', value => {
  
  return `¥ ${formatNumber(value)}`
})

