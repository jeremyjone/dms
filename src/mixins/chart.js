export default {
  computed: {
    textStyle() {
      return { color: this.$q.dark.isActive ? "#fff" : "#000" };
    }
  }
};
