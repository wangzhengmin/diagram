<template>
  <a class="w-sprite w-sprite-zoomin" title="放大" @click="zoomIn"></a>
  <a class="w-sprite w-sprite-zoomout" title="缩小" @click="zoomOut"></a>
</template>

<script>
export default {
  name: "Zoom",
};
</script>
<script setup>
import { getGraph } from "@/mxgraph";

const zoomIn = () => {
  const graph = getGraph();
  graph.zoomIn();
};

const zoomOut = () => {
  const graph = getGraph();
  graph.zoomOut();
};
</script>

<style></style>
