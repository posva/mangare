<template>
  <div id="mangare">
    <vue-progress v-ref:progress :percent.sync="progress.percent" :options="progress.options"></vue-progress>
    <h1>Mangare</h1>
    <a v-link="{ path: '/' }">Home</a>
    <a v-link="{ name: 'search' }">Search</a>
    <router-view></router-view>
  </div>
</template>

<script>
import VueProgress from 'vue-progressbar/vue-progressbar.vue'

export default {
  data () {
    return {
      progress: {
        percent: 0,
        options: {
          show: true,
          canSuccess: true,
          color: 'rgb(32, 161, 255)',
          failedColor: 'red',
          height: '2px'
        }
      }
    }
  },
  components: {
    VueProgress
  },
  ready () {
    this.$progress.setHolder(this.$refs.progress)
  }
}
</script>

<style>
html {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

#mangare {
  color: #2c3e50;
  margin-top: -100px;
  max-width: 600px;
  font-family: Source Sans Pro, Helvetica, sans-serif;
  text-align: center;
}

#mangare a {
  color: #42b983;
  text-decoration: none;
}

.logo {
  width: 100px;
  height: 100px
}
</style>
