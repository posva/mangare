<template>
  <div id="app">
    <!-- <vue-progress v-ref:progress :percent.sync="progress.percent" :options="progress.options"></vue-progress> -->
    <nav id="nav">
      <router-link :to="{ name: 'search' }">
        <h1>
          <img class="logo emoji" draggable="false" alt="🍙" src="//twemoji.maxcdn.com/2/72x72/1f359.png">
          Mangare
        </h1>
      </router-link>
    </nav>
    <section id="container">
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
// import VueProgress from 'vue-progressbar/vue-progressbar.vue'

export default {
  name: 'App',
  data () {
    return {
      progress: {
        percent: 0,
        options: {
          show: true,
          canSuccess: true,
          color: 'rgb(32, 161, 255)',
          failedColor: 'red',
          height: '4px'
        }
      }
    }
  },
  components: {
    // VueProgress
  },
  ready () {
    // this.$progress.setHolder(this.$refs.progress)
  }
}
</script>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Lato:100,300,400,700');
@import './assets/style/palette';
@import './assets/style/flex';

* {
  box-sizing: border-box;
}

body {
  background-color: $clear;
}

#app {
  @extend .flex;
  justify-content: space-between;
  flex-direction: column;
  font-family: Lato, Source Sans Pro, Helvetica, sans-serif;
  color: $dark;
}

#container {
  width: 100%;
  a {
    text-decoration: none;
  }
}

#nav {
  @extend .flex;
  padding: 0.5rem;
  width: 100%;
  background-color: lighten($dark, 30%);
  color: $clear;
  z-index: 10;

  a {
    color: @color;
    text-decoration: none;
  }

  h1 {
    display: inline-flex;
    font-weight: 300;
    letter-spacing: 2px;
    margin: 0;
    font-size: 2rem;

    .logo {
      margin-right: .75rem;
      height: @font-size;
    }

    @media (max-width: 700px) {
      font-size: 1.5rem;
      .logo {
        height: @font-size;
      }
    }
  }
}
</style>
