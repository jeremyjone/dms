<template>
  <q-layout view="lHr Lpr lFf">
    <dms-header />

    <q-page-container :style="{ 'min-width': 'inherit' }">
      <router-view>
        <template #toolbar="props">
          <dms-toolbar :menu="props.menu" :content="props.content" />
        </template>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { DmsHeader, DmsToolbar } from "@/components";

export default {
  name: "DmsHomePage",

  components: {
    DmsHeader,
    DmsToolbar
  }
};
</script>

<style></style>
