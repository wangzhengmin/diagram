<template>
  <div class="w-shape-sidebar">
    <p class="w-shape-sidebar-title">图形侧边栏</p>
    <div class="w-shape-container">
      <ShapeItem
        v-for="(shape, index) in shapes"
        :key="index"
        :cells="shape"
        @mouseenter="showPreview"
        @mouseleave="hidePreview"
      />
    </div>
    <div class="w-shape-preview" v-show="previewShape.src">
      <img
        :src="previewShape.src"
        alt=""
        :style="{
          width: previewShape.width + 'px',
          height: `${previewShape.height}px`,
        }"
      />
    </div>
  </div>
</template>

<script setup>
import ShapeItem from "./ShapeItem.vue";
import { defineProps, ref } from "vue";
defineProps({
  shapes: Array,
});
const previewShape = ref({});
const showPreview = (info) => {
  previewShape.value = info;
};
const hidePreview = () => {
  previewShape.value = {};
};
</script>

<style lang="scss" scoped>
.w-shape-sidebar {
  position: relative;
  flex: 0 0 auto;
  width: 301px;
  margin-right: 20px;
  border: 1px solid #dadce0;
  .w-shape-sidebar-title {
    text-align: center;
    line-height: 30px;
    border-bottom: 1px solid #dadce0;
  }
  .w-shape-preview {
    padding: 5px;
    position: absolute;
    left: 265px;
    top: 50px;
    z-index: 999;
    background-color: #e0e0e0;
    > img {
      width: auto;
      height: auto;
    }
  }
}
</style>
