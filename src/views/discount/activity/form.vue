<template>
  <div class="app-container">
    <el-form label-width="120px">

      <el-form-item label="活动名称">
        <el-input v-model="activityInfo.activityName"/>
      </el-form-item>
      <el-form-item label="活动类型">
        <el-radio-group v-model="activityInfo.activityType">
          <el-radio label="FULL_REDUCTION">满减</el-radio>
          <el-radio label="FULL_DISCOUNT">满量打折</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="活动时间">
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
      <el-form-item label="活动描述">
        <el-input v-model="activityInfo.activityDesc" :rows="3" type="textarea"/>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
        <el-button @click="$router.replace('/discount/activity/list')">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

const defaultForm = {
  id: '',
  activityName: '',
  activityType: 'FULL_REDUCTION',
  activityDesc: '',
  createTime: '',
  endTime: ''
}

export default {
  name: 'ActivityForm',
  data() {
    return {
      activityInfo: defaultForm,
      saveBtnDisabled: false,
      startEnd: [],
    }
  },

  // 监听器
  watch: {
    $route(to, from) {
      this.init()
    },

    startEnd (value) {
     if (value.length===2) {
       this.activityInfo.startTime = value[0]
       this.activityInfo.endTime = value[1]
     } 
    }
  },

  created() {
    this.init()
  },

  methods: {

    /* 
    禁用当天之后的时间选择, 返回true是禁用
    */
    disabledDate (time) {
      // new Date(new Date().toLocaleDateString()).getTime(): 得到当天的起始时间
      return time.getTime() < new Date(new Date().toLocaleDateString()).getTime()
    },

    // 表单初始化
    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.fetchDataById(id)
      } else {
        this.activityInfo = { ...defaultForm }
      }
    },

    saveOrUpdate() {
      this.saveBtnDisabled = true // 防止表单重复提交
      this.$API.activityInfo[!this.activityInfo.id ? 'save' : 'updateById'](this.activityInfo)
        .then(response => {
          if (response.code) {
            this.$message({
              type: 'success',
              message: response.message
            })
            this.$router.replace('/discount/activity/list')
          }
        })
        .finally(() => {
          this.saveBtnDisabled = false
        })
    },

    // 根据id查询记录
    fetchDataById(id) {
      this.$API.activityInfo.getById(id)
        .then(response => {
          this.activityInfo = response.data
          this.startEnd = [this.activityInfo.createTime, this.activityInfo.endTime]
        })
    }
  }
}
</script>
