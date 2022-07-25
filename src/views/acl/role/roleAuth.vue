<template>
  <div>
    <el-input disabled :value="$route.query.roleName"></el-input>
    <el-tree 
      style="margin: 20px 0"
      ref="tree"
      :data="allPermissions" 
      node-key="id"  
      show-checkbox 
      default-expand-all
      :props="defaultProps" 
    />
    <el-button :loading="loading" type="primary" @click="save">保存</el-button>
    <el-button @click="cancel">取消</el-button>
  </div>
</template>
<script>

  export default {
    name: 'roleAuth',

    data() {
      return {
        loading: false, // 用来标识是否正在保存请求中的标识, 防止重复提交
        allPermissions: [], // 所有
        defaultProps: {
          children: 'children',
          label: 'name'
        },
      };
    },

    created() {
      this.init()
    },

    methods: {
      /* 
      初始化
      */
      init() {
        const roleId = this.$route.params.id
        this.getPermissions(roleId)
      },

      /* 
      获取指定角色的权限列表
      */
      getPermissions(roleId) {
        this.$API.permission.toAssign(roleId).then(result => {
          const allPermissions = result.data.children
          this.allPermissions = allPermissions
          const checkedIds = this.getCheckedIds(allPermissions)
          // console.log('getPermissions() checkedIds', checkedIds)
          this.$refs.tree.setCheckedKeys(checkedIds)
        })
      },

      /* 
      得到所有选中的id列表
      只用得到所有选中的按钮权限数据的id
      */
      getCheckedIds (auths, initArr = []) {
        return auths.reduce((pre, item) => {
          if (item.select && item.level===4) {
           pre.push(item.id)
          } else if (item.children) {
            this.getCheckedIds(item.children, initArr)
          }
          return pre
        }, initArr)

        
        /* auths.forEach(item => {
          if (item.select && item.level===4) {
            initArr.push(item.id)
          } else if (item.children) {
            this.getCheckedIds(item.children, initArr)
          }
        })
        return initArr  */
       
      },

      /* 
      保存权限列表
      */
      save() {
        // 得到所有全选的id
        const checkedIds = this.$refs.tree.getCheckedKeys()
        // 得到所有半选的id
        const halfCheckedIds = this.$refs.tree.getHalfCheckedKeys()
        // 合并全选和半选的id， 并用逗号连接成串
        var ids = checkedIds.concat(halfCheckedIds).join(",")

        this.loading = true
        this.$API.permission.doAssign(this.$route.params.id, ids).then(result => {
          this.loading = false
          this.$message.success(result.$message || '分配权限成功')
          // 必须在跳转前获取(跳转后通过this获取不到正确的数据了)
          const roleName = this.$route.query.roleName
          const roles = this.$store.getters.roles
          this.$store.dispatch('tagsView/delView', this.$route)
          this.$router.replace('/acl/role/list', () => {
            console.log('replace onComplete')
            // 跳转成功后, 判断如果更新的是当前用户对应角色的权限, 重新加载页面以获得最新的数据
            if (roles.includes(roleName)) {
              window.location.reload()
            }
          })
        })
      },

      /* 
      取消
      */
      cancel () {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.replace({name: 'Role'})
      }
    }
  };
</script>
