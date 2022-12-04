<template>
  <div class="w-format-sidebar-view">
    <ShapeSidebarVue :shapes="shapes" />
    <div id="graphContainer"></div>
    <FormatSidebar v-if="hasSidebar" />
  </div>
</template>

<script setup>
import FormatSidebar from "@/components/format-sidebar/FormatSidebar.vue";
import ShapeSidebarVue from "@/components/shape-sidebar/ShapeSidebar.vue";
import { generateGraph } from "@/mxgraph";
import { onMounted, shallowRef, ref } from "vue";
import createBasicShapes from "@/mxgraph/shapes/baseShape.js";

let shapes = shallowRef([]);
const hasSidebar = ref(false);

onMounted(() => {
  var graph = generateGraph(document.getElementById("graphContainer"));
  shapes.value = createBasicShapes();
  hasSidebar.value = true;
});
</script>

<style lang="scss" scoped>
.w-format-sidebar-view {
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
}
#graphContainer {
  width: 100%;
  flex: 1 1;
  background: url("../assets/images/grid.gif");
}
</style>
