<template>
  <div class="row inline q-gutter-sm q-my-sm">
    <q-card-section horizontal v-for="perm in role.permissions" :key="perm.id">
      <q-item-section avatar :style="{ 'min-width': '100px' }">
        <strong class="text-capitalize text-right full-width">
          {{ perm.description }}
        </strong>
      </q-item-section>
    </q-card-section>
  </div>
</template>

<script lang="ts">
import { PermissionItem, RoleItem } from "@/models/role";
import Vue, { PropType } from "vue";

export default Vue.extend({
  props: {
    role: Object as PropType<RoleItem>
  }
});
</script>

<style scoped></style>
