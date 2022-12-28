<template>
  <div id="graphContainer" tabindex="1"></div>
</template>

<script setup>
import { onMounted } from "vue";
import mxgraph, { generateGraph } from "@/mxgraph";
import { initCanvas } from "./index";
const { mxEvent, mxRubberband } = mxgraph;

const render = function () {
  const container = document.getElementById("graphContainer");
  // 禁用默认菜单
  mxEvent.disableContextMenu(container);
  const graph = generateGraph(container);
  new mxRubberband(graph);

  initCanvas();
  graph.setPanning(true);
  graph.view.validate();
  graph.sizeDidChange();
  graph.resetScrollbars();
};

onMounted(() => {
  render();
});
</script>

<style lang="scss" scoped>
#graphContainer {
  background: #efefef;
  outline: none;
  position: relative;
  overflow: auto;
  width: 100%;
  height: 100%;
}
</style>
