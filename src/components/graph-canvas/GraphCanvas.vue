<template>
  <div id="graphContainer" tabindex="1"></div>
</template>

<script setup>
import { onMounted, defineEmits } from "vue";
import mxgraph, { generateGraph } from "@/mxgraph";
import { initCanvas } from "./index";

const emit = defineEmits(["load"]);

const render = function () {
  const container = document.getElementById("graphContainer");
  // 禁用默认菜单
  // mxEvent.disableContextMenu(container);
  const graph = generateGraph(container);
  initCanvas();
  graph.setPanning(true);
  graph.view.validate();
  graph.sizeDidChange();
  graph.resetScrollbars();
  // 一定要等画布初始化完 才能加载图形， 即第一次validate 之后才能加载图形
  emit("load");
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
