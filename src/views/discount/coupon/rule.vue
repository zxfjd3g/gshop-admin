<template>
  <div class="app-container">

    <h4>优惠券信息</h4>
    <table class="table table-striped table-condenseda table-bordered" width="100%">
      <tbody>
      <tr>
        <th width="15%">优惠券名称</th>
        <td width="35%"><b style="font-size: 14px">{{ couponInfo.couponName }}</b></td>
        <th width="15%">优惠券类型</th>
        <td width="35%">
          {{ couponInfo.couponTypeString }}
        </td>
      </tr>
      <tr>
        <th>最多领用次数</th>
        <td>{{ couponInfo.limitNum }}</td>
        <th>每人限领次数</th>
        <td>{{ couponInfo.perLimit }}</td>
      </tr>
      <tr>
        <th>领取时间</th>
        <td>{{ couponInfo.startTime }}至{{ couponInfo.endTime }}</td>
        <th>过期时间</th>
        <td>{{ couponInfo.expireTime }}</td>
      </tr>
      </tbody>
    </table>

    <h4>优惠券类型</h4>
    <el-form label-width="140px" style="background: #f9f9f9;padding-top: 15px; padding-bottom: 1px;">
      <el-form-item v-if="couponInfo.couponType == 'CASH'" label="现金券金额（元）" style="width: 50%;">
        <el-input v-model="couponInfo.benefitAmount"/>
      </el-form-item>

      <el-form-item v-if="couponInfo.couponType == 'DISCOUNT'" label="折扣券折扣（折）" style="width: 50%;">
        <el-input v-model="couponInfo.benefitDiscount"/>
      </el-form-item>

      <el-form-item v-if="couponInfo.couponType == 'FULL_REDUCTION'" label="满减金额（元）" style="width: 50%;">
        <el-input v-model="couponInfo.conditionAmount"/>
      </el-form-item>

      <el-form-item v-if="couponInfo.couponType == 'FULL_REDUCTION'" label="优惠金额（元）" style="width: 50%;">
        <el-input v-model="couponInfo.benefitAmount"/>
      </el-form-item>

      <el-form-item v-if="couponInfo.couponType == 'FULL_DISCOUNT'" label="满减件数（件）" style="width: 50%;">
        <el-input v-model="couponInfo.conditionNum"/>
      </el-form-item>

      <el-form-item v-if="couponInfo.couponType == 'FULL_DISCOUNT'" label="优惠折扣（折）" style="width: 50%;">
        <el-input v-model="couponInfo.benefitDiscount"/>
      </el-form-item>
    </el-form>

    <h4>优惠券范围选择</h4>

    <el-tabs type="border-card" v-model="couponInfo.rangeType" 
      @tab-click="clickTab">
      <el-tab-pane label="SPU" name="SPU" >
        <div v-if="couponInfo.rangeType == 'SPU'" key="spu">
          <el-button type="" size="mini" @click="dialogSpduRangVisible = true">添加优惠券范围</el-button>
          <el-table
            v-loading="listLoading"
            :data="spuInfoList"
            border
            fit
            highlight-current-row>

            <el-table-column
              label="序号"
              width="70"
              align="center">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>

            <el-table-column prop="id" label="SPU ID" width="100"/>
            <el-table-column prop="spuName" label="名称" width="120"/>
            <el-table-column prop="description" label="描述" />

            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeSkuDataById(scope.$index)"/>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="三级分类" name="CATAGORY">
        <el-button type="" size="mini" @click="dialogCateRangVisible = true">添加优惠券范围</el-button>
        <el-table
          v-loading="listLoading"
          :data="category3List"
          border
          fit
          highlight-current-row>

          <el-table-column
            type="index"
            label="序号"
            width="70"
            align="center"/>

          <el-table-column prop="id" label="分类ID" width="100"/>
          <el-table-column prop="name" label="名称" />

          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" icon="el-icon-delete" 
                @click="removeCateDataById(scope.$index)"/>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="品牌" name="TRADEMARK">
        <el-button type="" size="mini" @click="dialogTradeRangVisible = true">添加优惠券范围</el-button>
        <el-table
          border
          fit
          highlight-current-row
          v-loading="listLoading"
          :data="trademarkList">

          <el-table-column
            type="index"
            label="序号"
            width="70"
            align="center"/>

          <el-table-column prop="id" label="品牌ID" width="100"/>
          <el-table-column prop="tmName" label="名称" />

          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeTradeDataById(scope.$index)"/>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <div style="margin-top: 15px;">
      <el-form label-width="0px">
        <el-form-item>
          <el-button :disabled="saveBtnDisabled" type="primary" @click="save">保存</el-button>
          <el-button @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog title="添加范围" :visible.sync="dialogSpduRangVisible" width="490px">
      <div style="margin-top: 20px;">
        <el-form inline class="demo-form-inline">
          <el-form-item>
            <el-autocomplete
              v-model="keyword"
              :fetch-suggestions="querySpuSearch"
              :trigger-on-focus="false"
              class="inline-input"
              placeholder="请输入关键字，选择活动商品"
              value-key="spuName"
              style="width: 400px;"
              @select="selectSpuData"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="" @click="dialogSpduRangVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog title="添加范围" :visible.sync="dialogCateRangVisible" width="490px">
      <div style="margin-top: 20px;">
        <el-form :inline="true" class="demo-form-inline">
          <CategorySelector @categoryChange="selectCategory" />
          <el-form-item>
            <el-button type="" @click="dialogCateRangVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog title="添加范围" :visible.sync="dialogTradeRangVisible" width="490px">
      <div style="margin-top: 20px;">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
            <el-autocomplete
              v-model="keyword"
              :fetch-suggestions="queryTradeSearch"
              :trigger-on-focus="false"
              class="inline-input"
              placeholder="请输入关键字，选择活动品牌"
              value-key="tmName"
              style="width: 400px;"
              @select="selectTradeData"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="" @click="dialogTradeRangVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>


export default {
  name: 'CouponRule',
  data() {
    return {
      listLoading: false, // 数据是否正在加载

      couponInfo: {
      },
      saveBtnDisabled: false,

      // 优惠券范围：SPU
      dialogSpduRangVisible: false,
      keyword: '',
      spuInfoList: [],

      // 优惠券范围：三级分类
      dialogCateRangVisible: false,
      category3List: [],

      // 优惠券范围：品牌
      dialogTradeRangVisible: false,
      trademarkList: []
    }
  },

  created() {
    this.init()
  },

  methods: {

    clickTab (tab) {
      this.couponInfo.rangeType = tab.name
    },

    // 表单初始化
    init() {
      const couponId = this.$route.params.id
      // 获取优惠券信息
      this.fetchDataById(couponId)
      // 获取优惠券规则与范围信息
      this.fetchRuleDataById(couponId)
    },

    save() {
      let rangeDesc = '可购买'
      const couponRangeList = []
      const {rangeType} = this.couponInfo
      if (rangeType === 'SPU') {
        this.spuInfoList.forEach(function(item) {
          rangeDesc += '：'
          couponRangeList.push({
            rangeType: 'SPU',
            rangeId: item.id
          })
          rangeDesc += item.spuName + ','
        })
      } else if (rangeType === 'CATAGORY') {
        rangeDesc += '分类：'
        this.category3List.forEach(function(item) {
          couponRangeList.push({
            rangeType: 'CATAGORY',
            rangeId: item.id
          })
          rangeDesc += item.name + ','
        })
      } else {
        this.trademarkList.forEach(function(item) {
          rangeDesc += '品牌：'
          couponRangeList.push({
            rangeType: 'TRADEMARK',
            rangeId: item.id
          })
          rangeDesc += item.tmName + ','
        })
      }
      if (rangeDesc.length > 3) {
        rangeDesc = rangeDesc.substring(0, rangeDesc.length - 1)
      } else {
        rangeDesc = ''
      }

      const ruleData = {
        couponId: this.couponInfo.id,
        rangeType: this.couponInfo.rangeType,
        conditionAmount: this.couponInfo.conditionAmount,
        conditionNum: this.couponInfo.conditionNum,
        benefitAmount: this.couponInfo.benefitAmount,
        benefitDiscount: this.couponInfo.benefitDiscount,
        couponRangeList: couponRangeList,
        rangeDesc: rangeDesc
      }

      this.$API.couponInfo.saveCouponRule(ruleData)
        .then(response => {
          this.$message.success(response.message)
          this.$router.replace('/discount/coupon/list')
        })
    },

    removeDataById(index) {
      this.activityRuleList.splice(index, 1)
    },

    back() {
      this.$router.replace('/discount/coupon/list')
    },

    fetchRuleDataById(id) {
      this.$API.couponInfo.findCouponRuleList(id).then(response => {
        this.spuInfoList = response.data.spuInfoList || []
        this.category3List = response.data.category3List || []
        this.trademarkList = response.data.trademarkList || []
      })
    },

    // 根据id查询记录
    fetchDataById(id) {
      this.$API.couponInfo.getById(id).then(result => {
        const couponInfo = result.data
        if (!couponInfo.rangeType) {
          couponInfo.rangeType = 'SPU'
        }

        this.couponInfo = couponInfo
      })
    },

    querySpuSearch(queryString, cb) {
      this.$API.spu.findSpuInfoByKeyword(queryString)
        .then(result => {
          cb(result.data)
        })
    },

    selectSpuData(item) {
      this.spuInfoList.push(item)
      this.dialogSpduRangVisible = false
    },

    removeSkuDataById(index) {
      this.spuInfoList.splice(index, 1)
    },

    selectCategory({categoryId, categoryName, level}) {
      if (level===3) {
        this.category3List.push({
          id: categoryId,
          name: categoryName
        })
        this.dialogCateRangVisible = false
      }
    },

    removeCateDataById(index) {
      this.category3List.splice(index, 1)
    },

    queryTradeSearch(queryString, cb) {
      this.$API.trademark.findBaseTrademarkByKeyword(queryString)
        .then(response => {
          cb(response.data)
        })
    },

    selectTradeData(item) {
      this.trademarkList.push(item)
      this.dialogTradeRangVisible = false
    },

    removeTradeDataById(index) {
      this.trademarkList.splice(index, 1)
    }
  }
}
</script>
<style>
  .app-container h4 {
    color: #606266;
  }
</style>
