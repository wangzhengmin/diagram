<template>
  <div class="w-shape-sidebar-view">
    <ShapeSidebarVue :shapes="shapes" />
    <GraphCanvas @load="loadShapes" />
  </div>
</template>

<script setup>
import ShapeSidebarVue from "@/components/shape-sidebar/ShapeSidebar.vue";
import { onMounted, shallowRef } from "vue";
import createBasicShapes from "@/mxgraph/shapes/baseShape.js";
import GraphCanvas from "../components/graph-canvas/GraphCanvas.vue";
import mxgraph, { createTemporaryGraph, getGraph } from "@/mxgraph";
import {
  initPlaceCabinet,
  destoryPlaceCabinet,
  getCabinetNewCoord,
  cabinet,
  isCabinet,
  isPlaceCabinet,
  deviceUnit,
  isDevice,
} from "@/compositions/cabinet.js";

const { mxCell, mxGeometry, mxGraph, mxLayoutManager, mxGraphLayout } = mxgraph;

let shapes = shallowRef([]);
const initCabinetLayout = () => {
  const graph = getGraph();

  let layoutManager = new mxLayoutManager(graph);
  const cabinetLayout = new mxGraphLayout(graph);
  layoutManager.getLayout = function () {
    return cabinetLayout;
  };

  graph.isValidDropTarget = function (target, cells, evt) {
    if (
      isCabinet(this.getCellStyle(cells[0])) &&
      cabinet.placeList.length === 0
    ) {
      initPlaceCabinet();
    }

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
    const model = this.getModel();
    let result = [];
    const firstCell = cells[0];
    const cellStyle = this.getCellStyle(firstCell);
    // 是否是机柜或者设备移动
    if (isCabinet(cellStyle) || isDevice(cellStyle)) {
      // 是否是机柜移动占位机柜
      if (
        target &&
        isCabinet(cellStyle) &&
        isPlaceCabinet(this.getCellStyle(target))
      ) {
        const placeCabinetGeo = target.geometry;
        const cabinetGeo = firstCell.geometry;
        dx = placeCabinetGeo.x - cabinetGeo.x;
        dy = placeCabinetGeo.y - cabinetGeo.y;

        originGraphMoveCells.apply(this, [
          cells,
          dx,
          dy,
          clone,
          null,
          evt,
          mapping,
        ]);

        destoryPlaceCabinet();
      } else if (
        target &&
        isDevice(cellStyle) &&
        isCabinet(this.getCellStyle(target))
      ) {
        console.log(firstCell);
        // 不要使用geometry方法不然获取到的不是未移动前坐标
        const deviceGeo = firstCell.geometry;
        const cabinetGeo = target.geometry;
        const distance = deviceGeo.y + dy - cabinetGeo.y;
        const startIndex = Math.round(distance / deviceUnit);
        const newY = cabinetGeo.y + startIndex * deviceUnit;
        const newX = cabinetGeo.x;
        dx = newX - deviceGeo.x;
        dy = newY - deviceGeo.y;
        console.log(dx,dy)
        originGraphMoveCells.apply(this, [
          cells,
          dx,
          dy,
          clone,
          target,
          evt,
          mapping,
        ]);
      }
    } else {
      result = originGraphMoveCells.apply(this, arguments);
    }
    return result;
  };
};

const loadShapes = () => {
  initCabinetLayout();

  const graph = getGraph();
  graph.timerAutoScroll = true;
  graph.allowAutoPanning = true;
  graph.setDropEnabled(true);
  createTemporaryGraph();
  const cabinet = new mxCell(
    "机柜",
    new mxGeometry(0, 0, 200, 500),
    "shape=rect;type=cabinet"
  );
  cabinet.vertex = true;

  const device = new mxCell(
    "设备",
    new mxGeometry(0, 0, 200, 50),
    "shape=rect;type=device"
  );
  device.vertex = true;

  shapes.value = [[cabinet], [device]];
};
</script>

<style lang="scss" scoped>
.w-shape-sidebar-view {
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
}
</style>
