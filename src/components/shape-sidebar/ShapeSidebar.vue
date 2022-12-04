<template>
  <div class="w-shape-sidebar">
    <p class="w-shape-sidebar-title">图形侧边栏</p>
    <div class="w-shape-container">
      <ShapeItem v-for="(shape, index) in shapes" :key="index" :cells="shape" />
    </div>
  </div>
</template>

<script setup>
import ShapeItem from "./ShapeItem.vue";
import { defineProps } from "vue";
defineProps({
  shapes: Array,
});
</script>

<style lang="scss" scoped>
.w-shape-sidebar {
  flex: 0 0 auto;
  width: 240px;
  margin-right: 20px;
  border: 1px solid #dadce0;
  .w-shape-sidebar-title {
    text-align: center;
    line-height: 30px;
    border-bottom: 1px solid #dadce0;
  }
}
</style>
