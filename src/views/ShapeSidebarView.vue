<template>
  <div class="w-shape-sidebar-view">
    <ShapeSidebarVue :shapes="shapes" />
    <GraphCanvas @load="loadShapes" />
  </div>
</template>

<script setup>
import ShapeSidebarVue from "@/components/shape-sidebar/ShapeSidebar.vue";
import { onMounted, shallowRef } from "vue";
import createBasicShapes from "@/mxgraph/shapes/baseShape.js";
import GraphCanvas from "../components/graph-canvas/GraphCanvas.vue";
import { createTemporaryGraph } from "@/mxgraph";

let shapes = shallowRef([]);

const loadShapes = () => {
  createTemporaryGraph();
  shapes.value = createBasicShapes();
};
</script>

<style lang="scss" scoped>
.w-shape-sidebar-view {
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
}
</style>
