<template>
  <!-- :style="style" -->
  <!-- @click="handleClick" -->
  <div class="page-preview"
       ref="container"
  >
    <!-- :style="imageStyle" -->
    <router-link
        :to="nextPageLink"
        title="Next Page"
        tag="img"
        :src="pageUrl"
    />
  </div>
</template>

<script>
export default {
  props: {
    pageUrl: String,
    nextPageLink: Object
  }
}
</script>

<style lang="stylus">
@import '../assets/style/palette';

.page-preview {
  position: fixed;
  display: flex;
  z-index: 20;
  overflow: hidden;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  padding: 0;
  margin: 0;
  transition: opacity .3s;
  background-color: clear;

  &:hover {
    cursor: zoom-out;
  }

  img {
    max-height: 100%;
    max-width: @max-height;
    margin: auto;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
