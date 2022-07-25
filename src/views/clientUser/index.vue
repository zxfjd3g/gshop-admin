<template>
  <div class="app-container">
    <el-form inline>
      <el-form-item>
        <el-input v-model="tempSearchObj.keyword" placeholder="昵称/手机"/>
      </el-form-item>

      <el-form-item label="创建时间">
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
     
      <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
      <el-button type="default" @click="resetSearch">清空</el-button>
    </el-form>

    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      :data="users"
      stripe
      style="width: 100%">

      <el-table-column
        type="index"
        label="序号"
        width="70"
        align="center">
      </el-table-column>

      <el-table-column prop="phoneNum" label="手机号" />
      <el-table-column prop="nickName" label="昵称" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.status == 1 ? '正常' : '锁定' }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button v-if="$hasBP('btn.UserList.lock') && scope.row.status == 1" type="primary" size="mini" @click="lock(scope.row.id, 0)">锁定</el-button>
          <el-button v-if="$hasBP('btn.UserList.lock') && scope.row.status == 0" type="danger" size="mini" @click="lock(scope.row.id, 1)">取消锁定</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center;"
      layout="sizes, prev, pager, next, jumper, ->, total"
      @current-change="getUsers"
      @size-change="handleSizeChange"
    />
  </div>
</template>
<script>

export default {

  // 定义数据
  data() {
    return {
      listLoading: true, // 数据是否正在加载
      users: [], // 用户列表列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      tempSearchObj: {}, // 用来收集搜索条件输入的对象
      searchObj: {}, // 查询表单对象  createTimeBegin createTimeEnd
      startEnd: [], // 开始结束时间
    }
  },

  watch: {
    startEnd (value) {
     if (value.length===2) {
       this.tempSearchObj.createTimeBegin = value[0]
       this.tempSearchObj.createTimeEnd = value[1]
     }
    }
  },

  created() {
    this.getUsers()
  },

  methods: {

    /* 
    禁用当天之后的时间选择, 返回true是禁用
    */
    disabledDate (time) {
      // console.log(time.getTime() > Date.now())
      return time.getTime() > Date.now()
    },

    /* 
    请求获取指定页码的列表数据
    */
    getUsers (page = 1) {
      this.page = page
      this.listLoading = true
      console.log(this.listLoading)
      this.$API.clientUser.getPageList(this.page, this.limit, this.searchObj)
        .then(
          response => {
            this.users = response.data.records
            this.total = response.data.total
          }
        )
        .finally(() => {
          this.listLoading = false
        })
    },

    /* 
    每页数量发生改变的监听回调
    */
    handleSizeChange(size) {
      this.limit = size
      this.getUsers()
    },

    /* 
    根据输入条件进行搜索
    */
    search () {
      this.searchObj = {...this.tempSearchObj}
      this.getUsers()
    },

    /* 
    重置输入再搜索
    */
    resetSearch () {
      this.tempSearchObj = {}
      this.searchObj = {}
      this.getUsers()
    },

    /* 
    锁定/取消锁定用户
    */
    lock(id, status) {
      this.$confirm('确定该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        return this.$API.clientUser.lock(id, status)
      }).then((response) => {
        this.getUsers(this.page)
        if (response.code) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }
      })
    }
  }
}
</script>
