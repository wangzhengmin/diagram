<template>
  <div>
    <p>cell 样式</p>
    <button
      class="w-button"
      :class="{
        'w-format_active': fontFormat.includes(mxConstants.FONT_BOLD),
      }"
      @click="toggleFontStyleWrapper(mxConstants.FONT_BOLD)"
    >
      <a class="w-sprite w-sprite-bold"></a>
    </button>
    <button
      class="w-button"
      :class="{
        'w-format_active': fontFormat.includes(mxConstants.FONT_ITALIC),
      }"
      @click="toggleFontStyleWrapper(mxConstants.FONT_ITALIC)"
    >
      <a class="w-sprite w-sprite-italic"></a>
    </button>
    <button
      class="w-button"
      :class="{
        'w-format_active': fontFormat.includes(mxConstants.FONT_UNDERLINE),
      }"
      @click="toggleFontStyleWrapper(mxConstants.FONT_UNDERLINE)"
    >
      <a class="w-sprite w-sprite-underline"></a>
    </button>
    <button
      class="w-button"
      @click="textLeft"
      :class="{ 'w-format_active': textAlign === 'left' }"
    >
      <a class="w-sprite w-sprite-left"></a>
    </button>
    <button
      class="w-button"
      @click="textCenter"
      :class="{ 'w-format_active': textAlign === 'center' }"
    >
      <a class="w-sprite w-sprite-center"></a>
    </button>
    <button
      class="w-button"
      @click="textRight"
      :class="{ 'w-format_active': textAlign === 'right' }"
    >
      <a class="w-sprite w-sprite-right"></a>
    </button>

    <button
      class="w-button"
      :class="{ 'w-format_active': lineAlign === 'top' }"
    >
      <a class="w-sprite w-sprite-top" @click="textTop"></a>
    </button>
    <button
      class="w-button"
      :class="{ 'w-format_active': lineAlign === 'middle' }"
    >
      <a class="w-sprite w-sprite-middle" @click="textMiddle"></a>
    </button>
    <button
      class="w-button"
      :class="{ 'w-format_active': lineAlign === 'bottom' }"
    >
      <a class="w-sprite w-sprite-bottom" @click="textBottom"></a>
    </button>
  </div>
</template>
<script>
export default {
  name: "CellFormat",
};
</script>
<script setup>
import mxgraph, { getGraph } from "@/mxgraph";
import { setStyles } from "@/mxgraph/editor";
import { onMounted, reactive, ref } from "vue";
import { toggleFontStyle } from "@/mxgraph/actions";

const { mxConstants, mxEventObject, mxEvent, mxUtils } = mxgraph;

const textAlign = ref("");
const lineAlign = ref("");
const fontFormat = reactive([]);

const textLeft = () => {
  if (textAlign.value !== "left") {
    textAlign.value = "left";
    setStyles([mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_LEFT]);
  }
};
const textCenter = () => {
  if (textAlign.value !== "center") {
    textAlign.value = "center";
    setStyles([mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_CENTER]);
  }
};
const textRight = () => {
  if (textAlign.value !== "right") {
    textAlign.value = "right";
    setStyles([mxConstants.STYLE_ALIGN], [mxConstants.ALIGN_RIGHT]);
  }
};

const textTop = () => {
  if (lineAlign.value !== "top") {
    lineAlign.value = "top";
    setStyles([mxConstants.STYLE_VERTICAL_ALIGN], [mxConstants.ALIGN_TOP]);
  }
};
const textBottom = () => {
  if (lineAlign.value !== "bottom") {
    lineAlign.value = "bottom";
    setStyles([mxConstants.STYLE_VERTICAL_ALIGN], [mxConstants.ALIGN_BOTTOM]);
  }
};
const textMiddle = () => {
  if (lineAlign.value !== "middle") {
    lineAlign.value = "middle";
    setStyles([mxConstants.STYLE_VERTICAL_ALIGN], [mxConstants.ALIGN_MIDDLE]);
  }
};

const toggleFontStyleWrapper = (value) => {
  const index = fontFormat.indexOf(value);
  if (index > -1) {
    fontFormat.splice(index, 1);
  } else {
    fontFormat.push(value);
  }
  toggleFontStyle(value);
};

onMounted(() => {
  const graph = getGraph();
  graph.getSelectionModel().addListener(mxEvent.CHANGE, () => {
    const cells = graph.getSelectionCells();
    const cell = cells[0];
    if (cell) {
      const state = graph.view.getState(cell);
      const style = state.style;
      // 设置字体样式 粗体、斜体、下划线
      const fontStyle = mxUtils.getValue(style, mxConstants.STYLE_FONTSTYLE, 0);
      fontFormat.length = 0;
      if ((fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD) {
        fontFormat.push(mxConstants.FONT_BOLD);
      }
      if ((fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC) {
        fontFormat.push(mxConstants.FONT_ITALIC);
      }
      if (
        (fontStyle & mxConstants.FONT_UNDERLINE) ==
        mxConstants.FONT_UNDERLINE
      ) {
        fontFormat.push(mxConstants.FONT_UNDERLINE);
      }

      // 设置对齐方式
      const align = mxUtils.getValue(
        style,
        mxConstants.STYLE_ALIGN,
        mxConstants.ALIGN_CENTER
      );
      textAlign.value = align;

      // 位置 上 中 下
      const valign = mxUtils.getValue(
        style,
        mxConstants.STYLE_VERTICAL_ALIGN,
        mxConstants.ALIGN_MIDDLE
      );
      lineAlign.value = valign;
    }
  });
});
</script>

<style lang="scss" scoped>
.w-button {
  box-sizing: content-box;
  border-radius: 3px;
  opacity: 1;
  border: 1px solid rgb(160, 160, 160);
  padding: 3px 1px 4px 4px;
  margin: 1px 2px 1px 1px;
  width: 24px;
  height: 20px;
  background-color: #f5f5f5;
}
.w-format_active {
  background-image: linear-gradient(
    rgb(197, 236, 255) 0px,
    rgb(135, 212, 251) 100%
  );
}
</style>
