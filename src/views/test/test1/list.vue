<template>
  <div>
    <button v-if="$hasBP('btn.Test1.add')">添加</button>
    <button v-if="$hasBP('btn.Test1.update')">更新</button>
    <button v-if="$hasBP('btn.Test1.remove')">删除</button>
  </div>
</template>

<script>
export default {
  name: 'Test1List',
}
</script>

<style scoped>

</style>
