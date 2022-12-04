<template>
  <div class="w-toolbar-container">
    <component
      v-for="(name, index) in menus"
      :is="name"
      :key="index"
    ></component>
  </div>
</template>

<script>
import Zoom from "./Zoom.vue";
import History from "./History.vue";
export default {
  components: {
    Zoom,
    History,
  },
  data() {
    return {
      menus: ["Zoom", "History"],
    };
  },
};
</script>

<style scoped>
.w-toolbar-container {
  flex: 0 0 auto;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  align-content: center;
  height: 38px;
  background-color: #fbfbfb;
  border-bottom: 1px solid #dadce0;
}
</style>
