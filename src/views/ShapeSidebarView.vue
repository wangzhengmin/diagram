<template>
  <div class="w-shape-sidebar-view">
    <ShapeSidebarVue :shapes="shapes" />
    <div id="graphContainer"></div>
  </div>
</template>

<script setup>
import ShapeSidebarVue from "@/components/shape-sidebar/ShapeSidebar.vue";
import { generateGraph } from "@/mxgraph";
import { onMounted, shallowRef } from "vue";
import createBasicShapes from "@/mxgraph/shapes/baseShape.js";

let shapes = shallowRef([]);
onMounted(() => {
  var graph = generateGraph(document.getElementById("graphContainer"));
  shapes.value = createBasicShapes();
});
</script>

<style lang="scss" scoped>
.w-shape-sidebar-view {
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
