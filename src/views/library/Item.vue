<template>
  <div
    class="flex no-wrap bg-grey"
    :class="isHover ? 'shadow-10' : 'shadow-6'"
    @mouseenter.self="() => (isHover = true)"
    @mouseleave="() => (isHover = false)"
  >
    <div class="column dms-transition">
      <q-img
        alt="library cover"
        ratio="1"
        height="300px"
        :src="
          isImgError ? '' : require(`@/assets/images/test/${library.thumbnail}`)
        "
        @error="() => (isImgError = true)"
      >
        <div class="absolute-top text-subtitle1">
          <strong class="inline-block full-width text-center">
            {{ library.name }}
          </strong>
        </div>

        <transition
          enter-active-class="animate__animated animate__fadeIn"
          leave-active-class="animate__animated animate__fadeOut"
        >
          <div
            v-show="isHover"
            class="absolute-center dms-clear-padding no-wrap text-no-wrap"
          >
            <q-btn flat label="进入" @click="handleEnterAsset" />
            <q-btn
              v-if="$u.hasRole('library.edit')"
              flat
              label="管理"
              @click="handleManageLibraryItem"
            />
          </div>
        </transition>

        <transition
          enter-active-class="animate__animated animate__fadeIn"
          leave-active-class="animate__animated animate__fadeOut"
        >
          <div
            v-show="isHover"
            class="absolute-bottom text-caption text-center"
          >
            <em>{{ library.description }}</em>
          </div>
        </transition>
      </q-img>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { LibraryItem, LibraryUpdateItem } from "@/models/library";
import { Status } from "@/models/common";
import DmsLibraryInfo from "./Info.vue";

export default Vue.extend({
  name: "DmsLibraryItem",

  props: {
    library: {
      type: Object as PropType<LibraryItem>
    }
  },

  data() {
    return {
      isHover: false,
      isImgError: false
    };
  },

  computed: {},

  watch: {},

  methods: {
    handleEnterAsset() {
      this.$router.push({
        path: `${this.$pw.route.data}?id=${this.library.id}`
      });
    },

    handleDeleteLibrary() {
      this.$emit("delete", this.library.id);
    },

    handleManageLibraryItem() {
      this.$q
        .dialog({
          component: DmsLibraryInfo,
          parent: this,
          library: this.library,
          deleteFn: this.handleDeleteLibrary
        })
        .onOk(async (library: LibraryItem) => {
          this.$q.loading.show();

          // console.log("OK", emp);
          const [_, res] = await this.$s.UpdateLibrary(
            this.library.id,
            library as LibraryUpdateItem
          );
          if (res && res.status === Status.OK) {
            this.$emit("update", res.data);
            this.$pw.toast("更新成功", "success");
          }

          this.$q.loading.hide();
        });
    }
  },

  components: {}
});
</script>

<style lang="stylus" scoped></style>
