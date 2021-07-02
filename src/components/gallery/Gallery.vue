<template>
  <div class="full-width overflow-auto">
    <transition-group
      tag="div"
      class="bordered q-gutter-x-sm q-py-sm"
      name="update-data-flip"
      :style="{ 'white-space': 'nowrap' }"
    >
      <div
        class="update-data-item"
        v-for="(pic, index) in pictures.filter(p => !!p)"
        :key="pic"
      >
        <!-- :width="`${height}px`"
          class="gallery-select-image cursor-pointer"
          :style="{ height: `${height}px` }" -->
        <q-img
          crossorigin="anonymous"
          :style="{ 'min-width': `${height}px` }"
          :alt="pic"
          :src="local ? pic : require(`@/assets/images/test/${pic}`)"
          :height="`${height}px`"
          @click="$pw.viewer(this, pictures, index, local)"
        />
        <q-tooltip
          anchor="top middle"
          self="bottom middle"
          content-class="text-info"
          :delay="500"
        >
          <em class="block">点击左键放大查看</em>
          <em class="block" v-if="deletable">点击右键以删除</em>
        </q-tooltip>
        <q-popup-proxy ref="delProxy" context-menu v-if="deletable">
          <q-banner>
            <template v-slot:avatar>
              <q-icon name="error_outline" color="negative" />
            </template>
            <template v-slot>
              <div class="q-mb-sm">确认删除?</div>
              <div class="float-right">
                <q-btn
                  flat
                  dense
                  color="negative"
                  icon="cancel"
                  @click.stop="close"
                />
                <q-btn
                  flat
                  dense
                  color="positive"
                  icon="check_circle"
                  @click.stop="() => handleDelete(index)"
                />
              </div>
            </template>
          </q-banner>
        </q-popup-proxy>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { CustomVueComponent } from "@/models/common";

export default Vue.extend({
  name: "Gallery",

  props: {
    pictures: {
      type: Array as PropType<string[]>,
      required: true
    },

    height: {
      type: [Number, String],
      default: 200
    },

    deletable: {
      type: Boolean,
      default: true
    },

    local: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {};
  },

  computed: {},

  watch: {},

  methods: {
    close() {
      (this.$refs.delProxy as Vue[]).forEach(x =>
        (x as CustomVueComponent).hide()
      );
    },

    handleDelete(index: number) {
      this.$emit("delete", index);
    }
  },

  components: {}
});
</script>

<style lang="stylus" scoped>
.gallery-select-image
  &:hover
    animation pulse 1s

.update-data-flip-enter, .update-data-flip-leave-to
    animation flipInX 1s

.update-data-flip-leave-active
    position absolute
    animation flipOutX 1s
</style>
