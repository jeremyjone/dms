<template>
  <div>
    <q-expansion-item
      v-if="item.children && item.children.length > 0"
      expand-separator
      default-opened
      :header-inset-level="level"
      :label="item.name"
    >
      <dms-side-menu
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :level="level + 1"
        :selected="selected"
        @select="t => $emit('select', t)"
      />
    </q-expansion-item>

    <q-item
      v-else
      clickable
      active-class="bg-primary text-white"
      :active="item.id === selected.id"
      :inset-level="level"
      @click.stop="onClick"
    >
      <q-item-section>{{ item.name }}</q-item-section>
    </q-item>
  </div>
</template>

<script>
export default {
  name: "DmsSideMenu",

  props: {
    item: Object,
    level: Number,
    selected: Object
  },

  methods: {
    onClick() {
      this.$emit("select", this.item);
    }
  }
};
</script>
