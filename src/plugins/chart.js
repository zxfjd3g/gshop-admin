import Vue from 'vue'
import * as echarts from 'echarts'
import ECharts from 'vue-echarts'
// import VCharts from 'v-charts'

Vue.prototype.$echarts = echarts
Vue.component('v-chart', ECharts)
// Vue.use(VCharts)