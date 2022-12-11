<template>
  <div id="graphContainer" tabindex="1">
    <DiagramCanvas />
  </div>
</template>

<script setup>
import DiagramCanvas from "../../views/DiagramCanvas.vue";
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
