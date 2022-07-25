<template>
  <common-card title="今日订单" :value="orderToday|numberFormat">
    <template>
      <!-- <div ref="today-orders-chart" style="width:100%;height:100%"></div> -->
      <v-chart :option="getOption()" autoresize/>
    </template>
    <template v-slot:bottom>
      <span>昨日订单量</span>
      <span class="emphasis">{{orderLastDay | moneyFormat}}</span>
    </template>
  </common-card>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'TodayOrders',

  computed: {
    ...mapState({
      "orderToday": state => state.data.reportData.orderToday,
      "orderLastDay": state => state.data.reportData.orderLastDay,
      "orderTrend": state => state.data.reportData.orderTrend || [],
      "orderTrendAxis": state => state.data.reportData.orderTrendAxis || [],
    })
  },

  /* 
  mounted () {
    this.chart = this.$echarts.init(this.$refs['today-orders-chart'])
    this.chart.setOption(this.getOption())
  },

  watch: {
    orderToday () {
      this.chart.setOption(this.getOption())
    }
  }, 
  */

  
  methods: {
    getOption () {
      return {
        xAxis: {
          boundaryGap: false, // 两侧不留空白
          data: this.orderTrendAxis // x轴数据列表
        },
        yAxis: {
          show: false // 不显示y轴及标线
        },
        series: [
          {
            name: '实时订单数',
            type: 'line',
            // 列表数据
            data: this.orderTrend,
            // 线条光滑
            smooth: true,
            // 区域的样式
            areaStyle: {
              color: 'purple'
            },
            // 折线点的样式
            itemStyle: {
              opacity: 0
            },
            // 线的样式
            lineStyle: {
              opacity: 0
            }
          }
        ],
        // 图表在坐标中显示的位置
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        // 显示提示
        tooltip: {
          trigger: 'axis'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
