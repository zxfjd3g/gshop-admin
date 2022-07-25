<template>
  <div class="app-container">
    <el-form label-width="120px">

      <el-form-item label="优惠券名称">
        <el-input v-model="couponInfo.couponName"/>
      </el-form-item>
      <el-form-item label="优惠券类型">
        <el-radio-group v-model="couponInfo.couponType">
          <el-radio label="CASH">现金券</el-radio>
          <el-radio label="DISCOUNT">折扣券</el-radio>
          <el-radio label="FULL_REDUCTION">满减券</el-radio>
          <el-radio label="FULL_DISCOUNT">满量打折券</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="最多领用次数">
        <el-input type="number" v-model="couponInfo.limitNum"/>
      </el-form-item>
      
      <el-form-item label="领取时间">
        <el-date-picker
          v-model="startEnd"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="{disabledDate}">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="过期时间">
        <el-date-picker
          :disabled="!couponInfo.endTime"
          v-model="couponInfo.expireTime"
          type="datetime"
          placeholder="选择领取日期之后时间"
          value-format="yyyy-MM-dd HH:mm:ss" 
          :picker-options="{disabledDate: disabledET}"/>
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" @click="saveOrUpdate">保存</el-button>
        <el-button @click="back">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  data() {
    return {
      couponInfo: {
        couponName: '',
        couponType: 'CASH',
        couponTypeString: '现金券',
        createTime: '',
        limitNum: '',
        startTime: '',
        endTime: '',
        expireTime: '',
      },
      loading: false,
      startEnd: [],
    }
  },

  // 监听器
  watch: {

    startEnd (value) {
     if (value.length===2) {
       this.couponInfo.startTime = value[0]
       this.couponInfo.endTime = value[1]
     } 
    },

    // 一旦优惠券类型变化， 同步更新优惠券类型名称
    'couponInfo.couponType' (value) {
      const obj = {
        CASH: '现金券',
        DISCOUNT: '折扣券',
        FULL_REDUCTION: '满减券',
        FULL_DISCOUNT: '满量打折券',
      }
      this.couponInfo.couponTypeString = obj[value]
    }
  },

  created() {
    this.init()
  },

  methods: {

    /* 
    禁用当天之后的时间选择, 返回true是禁用
    */
    disabledET (time) {
      console.dir(time)
      if (this.couponInfo.endTime) {
        // 判断当前时间是否在指定领取的结束时间之前 =》 如果是之前就返回true禁用
        return dayjs(time.getTime()).isBefore(this.couponInfo.endTime)
      } else {
        return time.getTime() < Date.now()
      }
    },

    /* 
    禁用小于今天之前的时间
    */
    disabledDate(time) {
      // new Date(new Date().toLocaleDateString()).getTime(): 得到当天的起始时间
      return time.getTime() < new Date(new Date().toLocaleDateString()).getTime()
    },

    // 表单初始化
    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.fetchDataById(id)
      }
    },

    saveOrUpdate() {
      // 显示loading
      this.loading = true
      // 请求添加或更新优惠券
      this.$API.couponInfo[!this.couponInfo.id ? 'save' : 'updateById'](this.couponInfo)
        .then(response => {
          if (response.code) {
            this.$message({
              type: 'success',
              message: response.message
            })
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.replace({ path: '/discount/coupon/list' })
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 根据id查询记录
    fetchDataById(id) {
      this.$API.couponInfo.getById(id)
      .then(response => {
        this.couponInfo = response.data
        this.startEnd = [this.couponInfo.startTime,this.couponInfo.endTime]
      })
    },

    back () {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/discount/coupon/list')
    }
  }
}
</script>
