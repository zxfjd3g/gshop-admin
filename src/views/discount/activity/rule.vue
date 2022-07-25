<template>
  <div class="app-container">

    <h4>活动信息</h4>
    <table class="table table-striped table-condenseda table-bordered" width="100%">
      <tbody>
      <tr>
        <th width="15%">活动标题</th>
        <td width="35%"><b style="font-size: 14px">{{ activityInfo.activityName }}</b></td>
        <th width="15%">活动时间</th>
        <td width="35%">{{ activityInfo.startTime }}至{{ activityInfo.endTime }}</td>
      </tr>
      <tr>
        <th>活动类型</th>
        <td>{{ activityInfo.activityTypeString}}</td>
        <th>创建时间</th>
        <td>{{ activityInfo.createTime }}</td>
      </tr>
      <tr>
        <th>活动描述</th>
        <td colspan="3">{{ activityInfo.activityDesc }}</td>
      </tr>
      </tbody>
    </table>

    <el-dialog title="添加规则" :visible.sync="dialogRuleVisible" width="490px">
      <el-form label-width="120px" >
        <el-form-item v-if="activityInfo.activityType == 'FULL_REDUCTION'" label="满减金额">
          <el-input v-model="activityRule.conditionAmount"/>
        </el-form-item>

        <el-form-item v-if="activityInfo.activityType == 'FULL_REDUCTION'" label="优惠金额">
          <el-input v-model="activityRule.benefitAmount"/>
        </el-form-item>

        <el-form-item v-if="activityInfo.activityType == 'FULL_DISCOUNT'" label="满减件数">
          <el-input v-model="activityRule.conditionNum"/>
        </el-form-item>

        <el-form-item v-if="activityInfo.activityType == 'FULL_DISCOUNT'" label="优惠折扣">
          <el-input v-model="activityRule.benefitDiscount"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="add">添加</el-button>
          <el-button type="" @click="dialogRuleVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    
    <h4>
      规则列表&nbsp;&nbsp;&nbsp;
      <el-button type="" size="mini" @click="showAddRule">添加规则</el-button>
    </h4>

    <el-table
      border
      fit
      highlight-current-row
      v-loading="listLoading"
      :data="activityRuleList">

      <el-table-column
        label="序号"
        type="index"
        width="70"
        align="center" />

      <el-table-column label="活动类型" >
        <template slot-scope="scope">
          {{ activityInfo.activityType == 'FULL_REDUCTION' ? '满减' : '满量打折' }}
        </template>
      </el-table-column>

      <el-table-column v-if="activityInfo.activityType == 'FULL_REDUCTION'" prop="conditionAmount" label="满减金额" />
      <el-table-column v-if="activityInfo.activityType == 'FULL_REDUCTION'" prop="benefitAmount" label="优惠金额" />

      <el-table-column v-if="activityInfo.activityType == 'FULL_DISCOUNT'" prop="conditionNum" label="满减量数" />
      <el-table-column v-if="activityInfo.activityType == 'FULL_DISCOUNT'" prop="benefitDiscount" label="优惠折扣" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <hint-button title="删除活动" type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.$index)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加活动范围" :visible.sync="dialogRangVisible" width="490px">
      <div style="margin-top: 20px;">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
            <el-autocomplete
              v-model="keyword"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="false"
              class="inline-input"
              placeholder="请输入关键字，选择活动商品"
              value-key="skuName"
              style="width: 400px;"
              @select="selectData"
            />
          </el-form-item>

          <el-form-item>
            <el-button @click="dialogRangVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    
    <h4>
      活动范围列表&nbsp;&nbsp;&nbsp;
      <el-button type="" size="mini" @click="showAddRange">添加活动范围</el-button>
    </h4>

    <el-table
      v-loading="listLoading"
      :data="skuInfoList"
      border
      fit
      highlight-current-row>

      <el-table-column
        type="index"
        label="序号"
        width="70"
        align="center">
      </el-table-column>

      <el-table-column prop="id" label="SKU ID" width="100"/>
      <el-table-column label="banner" width="320" align="center">
        <template slot-scope="scope">
          <div class="info">
            <div class="pic">
              <img :src="scope.row.skuDefaultImg" alt="scope.row.title" style="width: 50px;">
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="skuName" label="名称" />
      <el-table-column prop="price" label="价格" width="70"/>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" icon="el-icon-delete" 
            @click="removeSkuDataById(scope.$index)"/>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加优惠券范围" :visible.sync="dialogCouponVisible" width="490px" 
      @close="dialogCouponVisible = false">
      <div style="margin-top: 20px;">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
            <el-autocomplete
              v-model="keyword"
              :fetch-suggestions="queryCouponSearch"
              :trigger-on-focus="false"
              class="inline-input"
              placeholder="请输入关键字，选择活动优惠券"
              value-key="couponName"
              style="width: 400px;"
              @select="selectCouponData"
            />
          </el-form-item>

          <el-form-item>
            <el-button @click="dialogCouponVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 优惠券 -->
    <h4>
      优惠券列表&nbsp;&nbsp;&nbsp;
      <el-button type="" size="mini" @click="showBindCoupon">绑定优惠券</el-button>
    </h4>
    <el-table
      border
      fit
      highlight-current-row
      v-loading="listLoading"
      :data="couponInfoList">
      <el-table-column
        type="index"
        label="序号"
        width="70"
        align="center" />

      <el-table-column prop="id" label="优惠券ID" width="100"/>
      <el-table-column prop="couponName" label="名称" />
      <el-table-column prop="conditionAmount" label="规则">
        <template slot-scope="scope">
          {{ scope.row.couponType == 'CASH' ? '减金额' + scope.row.benefitAmount + '元' :
          scope.row.couponType == 'DISCOUNT' ? '打' + scope.row.benefitDiscount + '折' :
          scope.row.couponType == 'FULL_REDUCTION' ? '减金额' + scope.row.benefitAmount + '元' : '满' + scope.row.conditionNum + '打' + scope.row.benefitDiscount + '折' }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/discount/coupon/rule/'+scope.row.id">
            <el-button size="mini">规则</el-button>
          </router-link>
          <hint-button title="删除优惠卷" type="danger" size="mini" icon="el-icon-delete" 
            @click="removeCouponDataById(scope.$index)"/>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 15px;">
      <el-form label-width="0px">
        <el-form-item>
          <el-button :disabled="saveBtnDisabled" type="primary" @click="save">保存</el-button>
          <el-button @click="$router.push('/discount/activity/list')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

const defaultForm = {
  activityId: '',
  conditionAmount: '',
  conditionNum: '',
  benefitAmount: '',
  benefitDiscount: '',
  benefitLevel: ''
}

export default {
  data() {
    return {
      listLoading: true, // 数据是否正在加载

      activityRule: defaultForm,
      saveBtnDisabled: false,

      dialogRuleVisible: false,
      activityInfo: {},
      activityRuleList: [],

      dialogRangVisible: false,
      keyword: '',
      skuInfoList: [],

      dialogCouponVisible: false,
      couponInfoList: []
    }
  },

  // 监听器
  watch: {
    $route(to, from) {
      this.init()
    }
  },

  created() {
    this.init()
  },

  methods: {

    showAddRange () {
      this.keyword = ''
      this.dialogRangVisible = true
    },

    showAddRule () {
      this.keyword = ''
      this.dialogRuleVisible = true
    },

    showBindCoupon () {
      this.keyword = ''
      this.dialogCouponVisible = true
    },

    init() {
      const activityId = this.$route.params.id
      this.fetchDataById(activityId)
      this.fetchRuleDataById(activityId)
    },

    // 新增
    add() {
      this.activityRuleList.push({
          activityId: this.activityInfo.id,
          conditionAmount: this.activityRule.conditionAmount,
          conditionNum: this.activityRule.conditionNum,
          benefitAmount: this.activityRule.benefitAmount,
          benefitDiscount: this.activityRule.benefitDiscount
      })
      this.activityRule = defaultForm
      this.dialogRuleVisible = false
    },

    save() {
      // const activitySkuList = []
      // this.skuInfoList.forEach(function(item) {
      //   activitySkuList.push({
      //     skuId: item.id
      //   })
      // })
      const activitySkuList = this.skuInfoList.map(item => ({
        skuId: item.id
      }))

      // const couponIdList = []
      // this.couponInfoList.forEach(function(item) {
      //   couponIdList.push(item.id)
      // })
      const couponIdList = this.couponInfoList.map(item => item.id)

      const ruleData = {
        activityId: this.activityInfo.id,
        activityRuleList: this.activityRuleList,
        activitySkuList,
        couponIdList
      }

      this.$API.activityInfo.saveActivityRule(ruleData)
        .then(result => {
          this.$message.success(result.message)
          this.$router.push('/discount/activity/list')
        })
    },

    removeDataById(index) {
      this.activityRuleList.splice(index, 1)
    },

    fetchRuleDataById(id) {
      this.$API.activityInfo.findActivityRuleList(id)
        .then(result => {
          this.activityRuleList = result.data.activityRuleList || []
          this.skuInfoList = result.data.skuInfoList || []
          this.couponInfoList = result.data.couponInfoList || []
          this.listLoading = false
        })
    },

    fetchDataById(id) {
      this.$API.activityInfo.getById(id)
        .then(result => {
          this.activityInfo = result.data
        })
    },

    querySearch(queryString, cb) {
      console.log(queryString)
      console.log(cb)

      this.$API.activityInfo.findSkuInfoByKeyword(queryString).then(result => {
        // 调用 callback 返回建议列表的数据
        cb(result.data)
      })
    },

    selectData(item) {
      this.skuInfoList.push(item)
      this.dialogRangVisible = false
    },

    /* 
    删除sku
    */
    removeSkuDataById(index) {
      this.skuInfoList.splice(index, 1)
    },

    /* 
    搜索优惠券范围
    */
    queryCouponSearch(queryString, cb) {
      this.$API.couponInfo.findCouponByKeyword(queryString)
        .then(result => {
          cb(result.data)
        })
    },

    /* 
    选择优惠项
    */
    selectCouponData(item) {
      this.couponInfoList.push(item)
      this.dialogCouponVisible = false
    },

    /* 
    删除优惠券
    */
    removeCouponDataById(index) {
      this.couponInfoList.splice(index, 1)
    }
  }
}
</script>
<style>
  .app-container h4 {
    color: #606266;
  }
</style>
