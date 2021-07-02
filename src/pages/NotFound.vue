<template>
  <div class="dms-not-found-bg">
    <q-btn
      class="absolute dms-not-fount-btn"
      color="primary"
      label="返回"
      :to="$pw.route.home"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "DmsNotFound"
});
</script>

<style lang="stylus" scoped>
.dms-not-found-bg
  background url(../assets/images/404-bg.jpg) no-repeat center
  width 100vw
  height 100vh

.dms-not-fount-btn
  top 62%
  left 50%
  transform translate(-50%, -50%)
  width 100px
</style>
