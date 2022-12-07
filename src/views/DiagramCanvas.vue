<template>
  <div class="w-canvas">
    <GraphCanvas />
  </div>
</template>

<script setup>
import GraphCanvas from "../components/graph-canvas/GraphCanvas.vue";
</script>

<style lang="scss" scoped>
.w-canvas {
  width: 100%;
  height: 100%;
  border: 1px solid red;
}
</style>
