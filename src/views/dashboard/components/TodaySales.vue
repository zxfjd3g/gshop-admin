<template>
  <common-card title="今日销售额" :value="salesToday | moneyFormat">
    <template>
      <div class="compare-wrap">
        <div class="compare">
          <div>日同比</div>
          <div class="emphasis">{{salesGrowthLastDay}}%</div>
          <div :class="salesGrowthLastDay>0 ? 'increment' : 'decrement'"></div>
        </div>
        <div class="compare">
          <div>日同比</div>
          <div class="emphasis">{{salesGrowthLastMonth}}%</div>
          <div :class="salesGrowthLastMonth>0 ? 'increment' : 'decrement'"></div>
        </div>
      </div>
    </template>
    <template v-slot:bottom>
      <span>昨日销售额</span>
      <span class="emphasis">{{salesLastDay | moneyFormat}}</span>
    </template>
  </common-card>
</template>

<script>

import {mapState} from 'vuex'

export default {
  name: 'TodaySales',

  computed: {
    ...mapState({
      "salesToday": state => state.data.reportData.salesToday,
      "salesLastDay": state => state.data.reportData.salesLastDay,
      "salesGrowthLastDay": state => state.data.reportData.salesGrowthLastDay,
      "salesGrowthLastMonth": state => state.data.reportData.salesGrowthLastMonth,
    })
  },
}
</script>

<style lang="scss" scoped>
  .compare-wrap {
      height: 100%;
      display: flex;
      flex-direction: column;
      font-size: 12px;
      font-weight: 600;
      color: #666;
      .compare {
        flex: 1;
        display: flex;
        align-items: center;
      }
    }
</style>
