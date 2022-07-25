<template>
  <div class="home">
    <top-view />
    <middle-view />
    <bottom-view />
  </div>
</template>

<script>
  import TopView from './components/TopView'
  import MiddleView from './components/MiddleView'
  import BottomView from './components/BottomView'

  export default {
    name: 'Home',
    components: {
      TopView, 
      MiddleView,
      BottomView,
    },
    
    mounted () {
      this.$store.dispatch('data/getReportData')
    }
  }
</script>

<style scoped>
  .home {
    width: 100%;
    padding: 20px;
    background: #eee;
  }
</style>
