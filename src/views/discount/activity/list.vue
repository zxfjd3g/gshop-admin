<template>
  <div class="app-container">

    <!-- 工具条 -->
    <div style="margin-bottom:10px;">
      <el-button type="primary" size="small" @click="add">添加</el-button>
      <el-button type="danger" size="small" @click="removeRows">批量删除</el-button>
    </div>

    <!-- 列表 -->
    <el-table
      border
      fit
      highlight-current-row
      row-key="id"
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据正在加载......"
      @selection-change="handleSelectionChange">

      <el-table-column
        type="selection"
        width="55" />

      <el-table-column
        type="index"
        label="序号"
        width="70"
        align="center">
      </el-table-column>

      <el-table-column prop="activityName" label="活动名称" />
      <el-table-column prop="activityTypeString" label="活动类型">
      </el-table-column>

      <el-table-column prop="startTime" label="开始时间" />
      <el-table-column prop="endTime" label="结束时间" />
      <el-table-column prop="createTime" label="创建时间" />

      <el-table-column label="操作" width="200" align="center">
        <template v-slot="{row}">
          <router-link :to="'/discount/activity/edit/'+row.id">
            <hint-button title="修改活动" type="primary" size="mini" icon="el-icon-edit"></hint-button>
          </router-link>
          <router-link :to="'/discount/activity/rule/'+row.id">
            <el-button type="" size="mini">规则</el-button>
          </router-link>
          <hint-button title="删除活动" type="danger" size="mini" icon="el-icon-delete" @click="deleteActivity(row.id)"></hint-button>
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
      layout="sizes, prev, pager, next, jumper, ->, total, slot"
      @current-change="fetchData"
      @size-change="changeSize"
    />
  </div>
</template>

<script>

export default {
  name: 'ActivityList',
  data() {
    return {
      listLoading: true, // 数据是否正在加载
      list: [], // 列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      multipleSelection: [] // 批量选择中选择的记录列表
    }
  },

  created() {
    this.fetchData()
  },

  methods: {

    // 当页码发生改变的时候
    changeSize(size) {
      this.limit = size
      this.fetchData(1)
    },

    // 跳转去添加
    add(){
      this.$router.push({ path: '/discount/activity/add' })
    },

    // 加载列表数据
    fetchData(page = 1) {
      this.page = page
      this.listLoading = true
      this.$API.activityInfo.getPageList(this.page, this.limit).then(
        result => {
          this.list = result.data.records
          this.total = result.data.total
          // 数据加载并绑定成功
          this.listLoading = false
        }
      )
    },

    // 根据id删除
    deleteActivity(id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定，远程调用ajax
        return this.$API.activityInfo.removeById(id)
      }).then((response) => {
        this.fetchData(this.page)
        if (response.code) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 当表格复选框选项发生变化的时候触发
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },

    // 批量删除
    removeRows() {

      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的记录!'
        })
        return
      }

      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        // 遍历selection，将id取出放入id列表
        var idList = []
        this.multipleSelection.forEach(item => {
          idList.push(item.id)
        })
        // 调用api
        return this.$API.activityInfo.removeRows(idList)
      }).then((response) => {
        this.fetchData(this.page)
        if (response.code) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

