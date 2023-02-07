<template>
  <div
    class="w-shape-item"
    ref="shapeRef"
    @mouseenter="emit('mouseenter', imageInfo)"
    @mouseleave="emit('mouseleave', imageInfo)"
  ></div>
</template>

<script setup>
import mxgraph, { getGraph, getTemporaryGraph } from "@/mxgraph";
import { defineProps, onMounted, ref, reactive, defineEmits } from "vue";
import { toBase64 } from "js-base64";
import {
  initPlaceCabinet,
  destoryPlaceCabinet,
  getCabinetNewCoord,
  isCabinet,
  isPlaceCabinet,
  isDevice,
  cabinet,
  deviceUnit,
} from "@/compositions/cabinet.js";
import { getAttributeData } from "../../compositions/cabinet";

const { mxUtils, mxEvent, mxDragSource, mxCell, mxGeometry } = mxgraph;
const shapeRef = ref();
const imageInfo = ref({});
const emit = defineEmits(["mouseenter", "mouseleave"]);
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

  const image = createShapeImage(svg);
  image.style.height = "100%";
  image.style.width = "100%";
  imageInfo.value = {
    src: image.src,
    height,
    width,
  };

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
  node.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

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

  const originMouseMove = mxDragSource.prototype.mouseMove;
  ds.mouseMove = function (evt) {
    var graph = this.getGraphForEvent(evt);
    const currentCell = props.cells[0];
    const style = graph.getCellStyle(currentCell);
    if (isCabinet(style) && cabinet.placeList.length === 0) {
      initPlaceCabinet();
    }
    return originMouseMove.apply(this, arguments);
  };
  const originMouseUp = mxDragSource.prototype.mouseUp;
  ds.mouseUp = function () {
    destoryPlaceCabinet();
    return originMouseUp.apply(this, arguments);
  };

  ds.getDropTarget = function (graph, x, y, evt) {
    const cellStyle = graph.getCellStyle(props.cells[0]);
    // 是否是机柜或者设备的放置
    if (isDevice(cellStyle) || isCabinet(cellStyle)) {
      var target = graph.getCellAt(x, y, null);
      if (target) {
        const targetStyle = graph.getCellStyle(target);
        if (
          (isDevice(cellStyle) && isCabinet(targetStyle)) ||
          (isCabinet(cellStyle) && isPlaceCabinet(targetStyle))
        ) {
          return target;
        }
      }
    }
    return null;
  };

  const originDrop = mxDragSource.prototype.drop;
  ds.drop = function (graph, evt, dropTarget, x, y) {
    const cellStyle = graph.getCellStyle(props.cells[0]);
    if (dropTarget && isCabinet(cellStyle)) {
      let value = graph.getModel().getValue(dropTarget);
      const xAxis = value.getAttribute("x");
      const yAxis = value.getAttribute("y");
      const cabinetId = graph
        .getModel()
        .getValue(props.cells[0])
        .getAttribute("id");
      if (xAxis && yAxis) {
        cabinet.list.push({ id: cabinetId, label: "机柜", x: xAxis, y: yAxis });
      }
    } else if (dropTarget && isDevice(cellStyle)) {
      let value = graph.getModel().getValue(dropTarget);
      const cabinetId = value.getAttribute("id");
      const cabinetData = cabinet.list.find((item) => item.id === cabinetId);
      if (cabinetData) {
        let value = graph.getModel().getValue(props.cells[0]);
        const data = getAttributeData(value);
        cabinetData?.deviceList.push({ ...data, cabinetId });
      }
    }
    return originDrop.apply(this, arguments);
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
  &:hover {
    background-color: #e0e0e0;
  }
}
</style>
