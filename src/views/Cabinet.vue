<template>
  <div>
    <h1>机柜布局</h1>

    <div id="graphContainer"></div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import mxgraph, { generateGraph, getGraph } from "@/mxgraph";

const {
  mxGraph,
  mxGraphLayout,
  mxClient,
  mxUtils,
  mxRectangle,
  mxLayoutManager,
  mxRubberband,
  mxKeyHandler,
  mxStackLayout,
  mxEvent,
} = mxgraph;

function CabinetLayout(graph) {
  mxGraphLayout.call(this, graph);
}
CabinetLayout.prototype = new mxStackLayout();

CabinetLayout.prototype.execute = function (parent, ...data) {
  if (parent != null) {
    var model = this.graph.getModel();
    model.beginUpdate();
    try {
      var rows = model.getChildCells(parent, true);
      const pgeo = this.graph.getCellGeometry(parent);
      console.log(pgeo.width);
      for (let i = 0; i < rows.length; i++) {
        let geo = this.graph.getCellGeometry(rows[i]);
        geo = geo.clone();
        geo.x = 0;
        geo.y = i * 40;
        geo.width = pgeo.width;
        geo.height = 30;
        model.setGeometry(rows[i], geo);
      }
    } finally {
      model.endUpdate();
    }
  }
};
CabinetLayout.prototype.moveCell = function (cell, x, y) {
  console.log("move", cell, x, y);
};

const cabinetData = [
  { title: "机柜1", x: 0, y: 0 },
  { title: "机柜2", x: 1, y: 1 },
  { title: "机柜3", x: 0, y: 1 },
];

const initCabinet = () => {
  const graph = getGraph();
  const parent = graph.getDefaultParent();
  graph.getModel().beginUpdate();
  try {
    for (let cabinet of cabinetData) {
      const { x, y, title } = cabinet;
      const cell = graph.insertVertex(
        parent,
        null,
        title,
        20 + x * 120,
        20 + y * 320,
        100,
        300
      );
    }
    graph.insertVertex(parent, null, "设备1", 200, 20, 200, 50);
    graph.insertVertex(parent, null, "设备2", 200, 90, 200, 50);
    graph.insertVertex(parent, null, "设备3", 200, 160, 300, 50);
    // var v1 = graph.insertVertex(parent, null, "Hello,", 20, 20, 80, 30);
    // var v2 = graph.insertVertex(parent, null, "World!", 200, 150, 80, 30);
    // graph.insertEdge(parent, null, "", v1, v2);
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }
};

const render = (container) => {
  if (!mxClient.isBrowserSupported()) {
    mxUtils.error("Browser is not supported!", 200, false);
  } else {
    var graph = generateGraph(container);
    graph.dropEnabled = true; // 是否可以拖拽图形到其它图形里

    graph.isValidDropTarget = (target, cells,evt) => {
      const pgeo = target.geometry;
      const cgeo = cells[0].geometry;
      if (pgeo && cgeo) {
        console.log(cgeo,evt)
        const { x, y, width, height } = pgeo;
        const centerX = cgeo.x + cgeo.width / 2;
        const centerY = cgeo.y + cgeo.height / 2;
        if (
          centerX > x &&
          centerX < x + width &&
          centerY > y &&
          centerY < y + height
        ) {
          return true;
        }
      }
      return false;
    };

    graph.getMaximumGraphBounds = () => {
      return new mxRectangle(0, 0, 8000, 8000);
    };

    const layout = new CabinetLayout(graph);
    const layoutMgr = new mxLayoutManager(graph);
    var model = graph.getModel();
    graph.isPool = function (cell) {
      return cell.value && cell.value.indexOf("机柜") > -1;
    };

    // graph.addListener(mxEvent.CELLS_ADDED, function (sender, evt) {
    //   var cells = evt.getProperty("cells");
    //   var parent = evt.getProperty("parent");
    //   console.log("CELLS_ADDED", cells, parent);
    // });
    layoutMgr.getLayout = function (cell, eventName) {
      if (
        !model.isEdge(cell) &&
        graph.getModel().getChildCount(cell) > 0 &&
        graph.isPool(cell)
      ) {
        return layout;
      }
      return null;
    };

    graph.resizeCell = function (cell) {
      console.log(cell);
    };
    var rubberband = new mxRubberband(graph);
    var keyHandler = new mxKeyHandler(graph);
    initCabinet();
  }
};

onMounted(() => {
  render(document.getElementById("graphContainer"));
});
</script>

<style lang="scss" scoped>
#graphContainer {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 600px;
  background: url("../assets/images/grid.gif");
  cursor: default;
  touch-action: none;
}
</style>
