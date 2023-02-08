<template>
  <div class="w-shape-item" ref="shapeRef"></div>
</template>

<script setup>
import mxgraph, { getGraph, getTemporaryGraph } from "@/mxgraph";
import { defineProps, onMounted, ref, computed } from "vue";
import { toBase64 } from "js-base64";

const { mxUtils, mxEvent, mxDragSource, mxCell, mxGeometry } = mxgraph;
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

const cabinetData = ref([]);

const cabinetCoordMap = computed(() => {
  return cabinetData.value.map((item) => {
    return `${item.x}-${item.y}`;
  });
});

const placeCabinet = ref([]);

const cabinetWidth = 200;
const cabinetHeight = 500;
const interval = 50;
const row = 2;
const col = 2;
// 初始化占位机柜
const initPlaceCabinet = () => {
  console.log(cabinetCoordMap.value, cabinetData.value);
  const arr = [];
  for (let x = 0; x < col; x++) {
    for (let y = 0; y < row; y++) {
      if (!cabinetCoordMap.value.includes(`${x}-${y}`)) {
        var doc = mxUtils.createXmlDocument();
        var node = doc.createElement("MyNode");
        node.setAttribute("label", "占位机柜");
        node.setAttribute("x", x);
        node.setAttribute("y", y);

        const cell = new mxCell(
          node,
          new mxGeometry(
            x * (cabinetWidth + interval),
            y * (cabinetHeight + interval),
            cabinetWidth,
            cabinetHeight
          ),
          "shape=rect;type=placeCabinet"
        );
        cell.vertex = true;
        arr.push(cell);
      }
    }
  }
  return arr;
};

// 删除占位机柜
const removePlaceCabinet = (graph, cells) => {
  console.log("remove", graph, cells);
  graph.removeCells(cells, false);
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
    if (style.type === "cabinet" && placeCabinet.value.length === 0) {
      const cells = initPlaceCabinet();

      placeCabinet.value = graph.importCells(cells);
    }
    originMouseMove.apply(this, arguments);
  };

  ds.getDropTarget = function (graph, x, y, evt) {
    var cell = graph.getCellAt(x, y, null);
    const style = graph.getCellStyle(cell);
    if (style.type === "placeCabinet") {
      return cell;
    }
    return null;
  };

  const originDrop = mxDragSource.prototype.drop;
  ds.drop = function (graph, evt, dropTarget, x, y) {
    if (dropTarget) {
      let value = graph.getModel().getValue(dropTarget);
      const attrList = value.attributes;
      const xAxis = value.getAttribute("x");
      const yAxis = value.getAttribute("y");
      if (xAxis && yAxis) {
        x = xAxis * (cabinetWidth + interval);
        y = yAxis * (cabinetHeight + interval);
        cabinetData.value.push({ title: "机柜", x: xAxis, y: yAxis });
        originDrop.apply(this, [graph, evt, null, x, y]);
      }
    }
    removePlaceCabinet(graph, placeCabinet.value);
    placeCabinet.value = [];
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
