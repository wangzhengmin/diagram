<template>
  <div class="w-shape-sidebar-view">
    <ShapeSidebarVue :shapes="shapes" />
    <GraphCanvas @load="loadShapes" />
  </div>
</template>

<script setup>
import ShapeSidebarVue from "@/components/shape-sidebar/ShapeSidebar.vue";
import { onMounted, shallowRef } from "vue";
import GraphCanvas from "../components/graph-canvas/GraphCanvas.vue";
import mxgraph, { createTemporaryGraph, getGraph } from "@/mxgraph";
import {
  initPlaceCabinet,
  destoryPlaceCabinet,
  getCabinetNewCoord,
  cabinet,
  isCabinet,
  isPlaceCabinet,
  isDevice,
  getNewOffset,
  initCabinet,
  getAttributeData,
  isValidStart,
} from "@/compositions/cabinet.js";
import {
  cellHeight,
  theadHeight,
  unitWidth,
} from "@/mxgraph/shapes/cabinetLayout/config.js";
import { getDeviceNewCoord } from "@/mxgraph/shapes/cabinetLayout/index.js";
import {
  createCabinet,
  createDevice,
  createPlaceCabinet,
} from "../mxgraph/shapes/cabinetLayout";
import { updateDevcieById, updateCabinetById } from "../compositions/cabinet";

const {
  mxCell,
  mxGraphHandler,
  mxGeometry,
  mxUtils,
  mxGraph,
  mxCellEditor,
  mxLayoutManager,
  mxGraphLayout,
  mxEvent,
} = mxgraph;

let shapes = shallowRef([]);
const initCabinetLayout = () => {
  const graph = getGraph();

  var graphCellLabelChanged = graph.cellLabelChanged;
  graph.cellLabelChanged = function (cell, newValue, autoSize) {
    const cellStyle = this.getCellStyle(cell);
    const parent = this.model.getParent(cell);
    const parentStyle = this.getCellStyle(parent);
    if (isCabinet(cellStyle)) {
      console.log("机柜属性更改");
    } else if (isDevice(cellStyle) || isDevice(parentStyle)) {
      console.log("设备属性更改");
    }
    graphCellLabelChanged.apply(this, arguments);
  };

  graph.isPart = function (cell) {
    return this.getCurrentCellStyle(cell)["constituent"] == "1";
  };

  graph.selectCellForEvent = function (cell) {
    if (this.isPart(cell)) {
      cell = this.model.getParent(cell);
    }

    mxGraph.prototype.selectCellForEvent.apply(this, [cell]);
  };

  graph.addMouseListener({
    mouseDown: mxUtils.bind(graph, function (sender, me) {
      const cells = this.graphHandler.cells;
      this.orderCells(false, cells);
    }),
    mouseMove: mxUtils.bind(graph, function (sender, me) {
      const cells = this.graphHandler.cells;
      if (this.isMouseDown && cells) {
        const cell = Array.isArray(cells) ? cells[0] : cells;
        const cellStyle = this.getCellStyle(cell);
        if (isCabinet(cellStyle) && cabinet.placeList.length === 0) {
          initPlaceCabinet();
        }
      }
    }),
    mouseUp: function (sender, me) {
      destoryPlaceCabinet();
    },
  });

  graph.isValidDropTarget = function (target, cells, evt) {
    if (target) {
      const firstCell = cells[0];
      const targetStyle = this.getCellStyle(target);
      const cellStyle = this.getCellStyle(firstCell);
      // 是否是机柜移动到占位机柜
      if (
        (isCabinet(cellStyle) && isPlaceCabinet(targetStyle)) ||
        (isDevice(cellStyle) && isCabinet(targetStyle))
      ) {
        return target;
      }
    }
    return null;
  };

  const originGraphMoveCells = mxGraph.prototype.moveCells;
  graph.moveCells = function (cells, dx, dy, clone, target, evt, mapping) {
    let result = [];
    const firstCell = cells[0];
    const cellStyle = this.getCellStyle(firstCell);
    // 是否是机柜移动到占位机柜
    const isMoveToPlaceCabinet =
      target &&
      isCabinet(cellStyle) &&
      isPlaceCabinet(this.getCellStyle(target));
    if (isCabinet(cellStyle)) {
      if (isMoveToPlaceCabinet) {
        const placeCabinetGeo = target.geometry;
        const cabinetGeo = firstCell.geometry;
        dx = placeCabinetGeo.x - cabinetGeo.x;
        dy = placeCabinetGeo.y - cabinetGeo.y;

        const placeCabinetValue = this.getModel().getValue(target);
        const placeCabinetData = getAttributeData(placeCabinetValue);
        const cabinetValue = this.getModel().getValue(firstCell);
        const cabinetData = getAttributeData(cabinetValue);
        updateCabinetById(cabinetData.id, {
          x: parseInt(placeCabinetData.x, 10),
          y: parseInt(placeCabinetData.y, 10),
        });

        target = null;
      } else {
        cells = [];
      }
    } else if (isDevice(cellStyle)) {
      let oldParent = graph.model.getParent(firstCell);
      // 是否是设备移动到机柜
      const isDeviceMoveToCabinet =
        target && isDevice(cellStyle) && isCabinet(this.getCellStyle(target));
      // 是否是机柜内移动设备
      const isCabinetMoveDevice =
        isDevice(cellStyle) &&
        !target &&
        isCabinet(this.getCellStyle(oldParent));

      const { offsetX, offsetY } = getNewOffset(firstCell, target, dx, dy);

      const childGeo = graph.model.getGeometry(firstCell);
      const distance = childGeo.y + dy + offsetY - theadHeight;

      const value = this.getModel().getValue(firstCell);
      const data = getAttributeData(value);
      const { start, end, id } = data;

      const newStart = Math.round(distance / cellHeight) + 1;
      const newEnd = newStart + parseInt(end) - parseInt(start);
      const { y: newY } = getDeviceNewCoord(newStart);

      let cabinetCell;
      if (isDeviceMoveToCabinet) {
        cabinetCell = target;
        dx = -offsetX - childGeo.x + unitWidth;
        dy = newY - offsetY - childGeo.y;
      } else if (isCabinetMoveDevice) {
        cabinetCell = oldParent;
        dx = -offsetX - childGeo.x + unitWidth;
        dy = newY - childGeo.y;
      } else {
        cells = [];
      }
      const cabinetValue = this.getModel().getValue(cabinetCell);
      const cabinetData = getAttributeData(cabinetValue);
      const isValid = isValidStart(newStart, newEnd, id, cabinetData.id);

      if (isValid) {
        updateDevcieById(id, {
          start: newStart,
          end: newEnd,
          cabinetId: cabinetData.id,
        });
      } else {
        cells = [];
      }
    }
    if (cells.length > 0) {
      result = originGraphMoveCells.apply(this, [
        cells,
        dx,
        dy,
        clone,
        target,
        evt,
        mapping,
      ]);
    }
    return result;
  };
};

const loadShapes = () => {
  const graph = getGraph();

  initCabinet();
  initCabinetLayout();
  graph.timerAutoScroll = true;
  graph.allowAutoPanning = true;
  graph.setDropEnabled(true);
  createTemporaryGraph();

  const cabinet = createCabinet();
  const device = createDevice(
    null,
    { weight: 22, power: 33, start: 1, end: 1 },
    true
  );
  const placeCabinet = createPlaceCabinet();
  shapes.value = [
    [cabinet],
    [device],
    [placeCabinet],
    [createDevice(null, { weight: 22, power: 33, start: 1, end: 1 }, true)],
  ];
};
</script>

<style lang="scss" scoped>
.w-shape-sidebar-view {
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
}
</style>
