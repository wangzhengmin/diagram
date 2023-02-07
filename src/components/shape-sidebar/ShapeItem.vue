<template>
  <div class="w-shape-item" ref="shapeRef"></div>
</template>

<script setup>
import mxgraph, { getGraph, getTemporaryGraph } from "@/mxgraph";
import { defineProps, onMounted, ref } from "vue";
import { toBase64 } from "js-base64";

const { mxUtils } = mxgraph;
const shapeRef = ref();

const props = defineProps({
  width: {
    type: Number,
    default: 60,
  },
  height: {
    type: Number,
    default: 40,
  },
  cells: Object,
});

// 创建图形图片
const createShapeImage = function (svg) {
  const image = new Image();
  const svgString = svg.outerHTML;
  image.src = `data:image/svg+xml;base64,${toBase64(svgString)}`;
  return image;
};

// 创建预览图形
const createPreview = function () {
  let cells = props.cells;
  let { width = props.width, height = props.height } =
    cells?.[0]?.geometry || {};
  var dragElt = document.createElement("div");
  dragElt.style.width = width + "px";
  dragElt.style.height = height + "px";
  const svg = createShapeSvg(width, height);
  console.log(svg);
  console.log(dragElt);
  const image = createShapeImage(svg);
  image.style.height = "100%";
  dragElt.appendChild(image);

  return dragElt;
};

// 创建图形svg
const createShapeSvg = function (width, height) {
  const graph = getTemporaryGraph();
  const cells = props.cells;

  graph.view.scaleAndTranslate(1, 0, 0);
  graph.addCells(cells);
  var bounds = graph.getGraphBounds();
  var s =
    Math.floor(Math.min(width / bounds.width, height / bounds.height) * 100) /
    100;
  graph.view.scaleAndTranslate(
    s,
    Math.floor((width - bounds.width * s) / 2 / s - bounds.x),
    Math.floor((height - bounds.height * s) / 2 / s - bounds.y)
  );

  var node = null;
  node = graph.view.getCanvas().ownerSVGElement.cloneNode(true);
  graph.getModel().clear();

  node.style.overflow = "hidden";
  node.style.width = width + "px";
  node.style.height = height + "px";
  node.style.visibility = "";
  node.style.minWidth = "";
  node.style.minHeight = "";
  node.setAttribute("version", 1.1);
  node.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  // 拖拽时文字不可见
  let texts = node.querySelectorAll("foreignObject");
  let len = texts.length;
  for (let i = 0; i < len; i++) {
    texts[i].firstChild.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  }

  return node;
};

const createHandler = function (graph, evt, target, x, y) {
  const cells = graph.importCells(props.cells, x, y, target);

  if (cells != null && cells.length > 0) {
    graph.scrollCellToVisible(cells[0]);
    graph.setSelectionCells(cells);
  }
};

const initShape = function () {
  const graph = getGraph();
  const dom = shapeRef.value;

  const svg = createShapeSvg(props.width, props.height);
  dom.appendChild(svg);

  const dragPreview = createPreview();

  var ds = mxUtils.makeDraggable(
    dom,
    graph,
    createHandler,
    dragPreview,
    0,
    0,
    graph.autoscroll,
    true,
    true
  );

  ds.isGuidesEnabled = function () {
    return graph.graphHandler.guidesEnabled;
  };
};

onMounted(() => {
  initShape();
});
</script>

<style lang="scss" scoped>
.w-shape-item {
  width: 60px;
  height: 40px;
  margin: 5px;
}
</style>
