<template>
  <div class="q-ma-lg q-gutter-y-lg">
    <h4 class="dms-clear-margin">
      欢迎：{{ $store.getters.name }}，您已来到工作台
    </h4>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "DmsAdminWorkplace",

  data() {
    return {};
  }
});
</script>

<style lang="stylus" scoped></style>
