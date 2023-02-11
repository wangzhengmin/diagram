import { reactive, computed } from "vue";
import mxgraph, { getGraph, getTemporaryGraph } from "@/mxgraph";
const { mxUtils, mxEvent, mxDragSource, mxCell, mxGeometry } = mxgraph;

export const cabinet = reactive({
  list: [], // 机柜列表
  placeList: [], // 占位列表
});

const cabinetCoordMap = computed(() => {
  return cabinet.list.map((item) => {
    return `${item.x}-${item.y}`;
  });
});

export const cabinetWidth = 200; // 机柜宽度
export const cabinetHeight = 500; // 机柜高度
export const interval = 50; // 机柜间隔
export const minX = 2; // 一排最少两个机柜
export const minY = 2; //  最少有两排机柜
export const deviceUnit = 50; // 设备高度
// 初始化渲染机柜
export function initCabinet() {}

// 创建机柜cell 数据
export function createCabinetCell(mode, x, y) {
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
    `shape=rect;type=${mode}`
  );
  cell.vertex = true;
  return cell;
}

// 渲染占位机柜
export function initPlaceCabinet() {
  const graph = getGraph();
  const cells = [];
  for (let x = 0; x < minX; x++) {
    for (let y = 0; y < minY; y++) {
      if (!cabinetCoordMap.value.includes(`${x}-${y}`)) {
        const cell = createCabinetCell("placeCabinet", x, y);
        cells.push(cell);
      }
    }
  }

  cabinet.placeList = graph.importCells(cells);
}

// 删除占位机柜
export function destoryPlaceCabinet() {
  const graph = getGraph();
  graph.removeCells(cabinet.placeList, false);
  cabinet.placeList = [];
}

// 根据x，y获取机柜的坐标
export function getCabinetNewCoord(x, y) {
  const newX = x * (cabinetWidth + interval);
  const newY = y * (cabinetHeight + interval);
  return {
    x: newX,
    y: newY,
  };
}

// 是否是机柜
export const isCabinet = (style) => style.type === "cabinet";
// 是否是占位机柜
export const isPlaceCabinet = (style) => style.type === "placeCabinet";
// 是否是设备
export const isDevice = (style) => style.type === "device";
