<template>
  <common-card title="今日交易用户数" :value="orderUser|numberFormat">
    <template>
      <v-chart :option="getOption()" autoresize/>
    </template>
    <template v-slot:bottom>
      <span>退货率</span>
      <span class="emphasis">{{returnRate + '%'}}</span>
    </template>
  </common-card>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'TodayUsers',

  computed: {
    ...mapState({
      "orderUser": state => state.data.reportData.orderUser,
      "returnRate": state => state.data.reportData.returnRate,
      "orderUserTrend": state => state.data.reportData.orderUserTrend || [],
      "orderUserTrendAxis": state => state.data.reportData.orderUserTrendAxis || [],
    })
  },

  methods: {
    getOption () {
      return {
        xAxis: {
          data: this.orderUserTrendAxis // x轴数据
        },
        yAxis: {
          show: false
        },
        series: [
          {
            name: '实时交易量', // 名称
            type: 'bar',
            // 列表数据
            data: this.orderUserTrend,
            barWidth: '60%' // 宽度占用比例
          }
        ],
        // 图表在坐标中显示的位置
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        color: ['#3398DB'], // 柱的颜色
        // 显示提示
        tooltip: {
          trigger: 'axis',
          confine: true,
          // position: function (point, params, dom, rect, size) {
          //   // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
          //   // 提示框位置
          //   let x = 0; // x坐标位置

          //   // 当前鼠标位置
          //   let pointX = point[0];

          //   // 提示框大小
          //   let boxWidth = size.contentSize[0];

          //   // boxWidth > pointX 说明鼠标左边放不下提示框
          //   if (boxWidth > pointX) {
          //     x = 5;
          //   } else { // 左边放的下
          //     x = pointX - boxWidth;
          //   }

          //   return [x, -40];
          // }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
