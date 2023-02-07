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
import mxgraph, { createTemporaryGraph } from "@/mxgraph";

const { mxCell, mxGeometry } = mxgraph;

let shapes = shallowRef([]);

const loadShapes = () => {
  createTemporaryGraph();
  const cabinet = new mxCell(
    "机柜",
    new mxGeometry(0, 0, 200, 500),
    "shape=rect;type=cabinet"
  );
  cabinet.vertex = true;

  const device = new mxCell(
    "设备",
    new mxGeometry(0, 0, 200, 50),
    "shape=rect;type=device"
  );
  device.vertex = true;

  shapes.value = [[cabinet], [device]];
};
</script>

<style lang="scss" scoped>
.w-shape-sidebar-view {
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
}
</style>
