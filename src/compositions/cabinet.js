import { reactive, computed } from "vue";
import mxgraph, { getGraph, getTemporaryGraph } from "@/mxgraph";
import { createPlaceCabinet } from "@/mxgraph/shapes/cabinetLayout";
import {
  cabinetInterval,
  cabinetWidth,
  cabinetHeight,
  cellHeight,
  theadHeight,
  unitWidth,
} from "@/mxgraph/shapes/cabinetLayout/config.js";
import { createCabinet, createDevice } from "../mxgraph/shapes/cabinetLayout";

const { mxPoint, mxUtils } = mxgraph;
export const cabinet = reactive({
  list: [
    {
      id: "cabinet-id1",
      x: 0,
      y: 0,
      deviceList: [
        {
          id: "device-id1",
          cabinetId: "cabinet-id1",
          weight: 22,
          power: 22,
          start: 1,
          end: 1,
        },
      ],
    },
    {
      id: "cabinet-id2",
      x: 1,
      y: 0,
      deviceList: [
        {
          id: "device-id2",
          cabinetId: "cabinet-id2",
          weight: 22,
          power: 22,
          start: 1,
          end: 1,
        },
        {
          id: "device-id3",
          cabinetId: "cabinet-id2",
          weight: 22,
          power: 22,
          start: 3,
          end: 4,
        },
      ],
    },
  ], // 机柜列表
  placeList: [], // 占位列表
});

const cabinetMap = computed(() => {
  const map = {};
  cabinet.list.forEach((item) => {
    map[item.id] = item;
  });
  return map;
});

const deviceMap = computed(() => {
  const map = {};
  cabinet.list.forEach((item) => {
    if (Array.isArray(item.deviceList)) {
      item.deviceList.forEach((device) => {
        map[device.id] = device;
      });
    }
  });
  return map;
});

const cabinetCoordMap = computed(() => {
  return cabinet.list.map((item) => {
    return `${item.x}-${item.y}`;
  });
});

export const minX = 2; // 一排最少两个机柜
export const minY = 2; //  最少有两排机柜

const maxX = computed(() => {
  let maxX = minX;
  cabinet.list.forEach((item) => {
    maxX = Math.max(maxX, item.x + 2);
  });
  return maxX;
});

const maxY = computed(() => {
  let maxY = minY;
  cabinet.list.forEach((item) => {
    maxY = Math.max(maxY, item.y + 2);
  });
  return maxY;
});

// 初始化渲染机柜
export function initCabinet() {
  const graph = getGraph();
  let cabinetCells = [];
  cabinet.list.forEach((item) => {
    const cabinetCell = createCabinet(item.id, item);
    cabinetCells.push(cabinetCell);

    if (Array.isArray(item.deviceList)) {
      item.deviceList.forEach((device) => {
        const deviceCell = createDevice(device.id, device);
        cabinetCell.insert(deviceCell);
      });
    }
  });
  graph.importCells(cabinetCells);
}

// 渲染占位机柜
export function initPlaceCabinet() {
  const graph = getGraph();
  const cells = [];

  for (let x = 0; x < maxX.value; x++) {
    for (let y = 0; y < maxY.value; y++) {
      if (!cabinetCoordMap.value.includes(`${x}-${y}`)) {
        const cell = createPlaceCabinet({ x, y });
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
  const newX = x * (cabinetWidth + cabinetInterval);
  const newY = y * (cabinetHeight + cabinetInterval);
  return {
    x: newX,
    y: newY,
  };
}

// 是否是机柜
export const isCabinet = (style) =>
  style.shape === "mxgraph.cabinetLayout.cabinet";
// 是否是占位机柜
export const isPlaceCabinet = (style) =>
  style.shape === "mxgraph.cabinetLayout.placeCabinet";
// 是否是设备
export const isDevice = (style) =>
  style.shape === "mxgraph.cabinetLayout.device";

export function getNewOffset(cell, parent, dx, dy) {
  const graph = getGraph();
  let offsetX = 0,
    offsetY = 0;
  // mxGraph.prototype.cellsAdded方法中对是否有新旧parent有额外处理
  if (cell && parent) {
    let zero = new mxPoint(0, 0);

    let newState = graph.view.getState(parent);
    let newOrigin = newState != null ? newState.origin : null;
    // 旧机柜
    let oldParent = graph.model.getParent(cell);
    // 新旧机柜位置不同
    let oldOrigin;
    if (newOrigin != null && cell != parent && parent != oldParent) {
      let oldState = graph.view.getState(oldParent);
      oldOrigin = oldState != null ? oldState.origin : zero;
      offsetX = oldOrigin.x - newOrigin.x;
      offsetY = oldOrigin.y - newOrigin.y;
    }
  }

  return { offsetX, offsetY };
}

export function isValidStart(start, end, id, cabinetId) {
  const deviceList = Object.values(deviceMap.value);
  const isValid = deviceList.every((item) => {
    //为undefined时说明是新增设备
    if ((item.cabinetId === cabinetId || !item.cabinetId) && item.id != id) {
      if (
        (start >= item.start && start <= item.end) ||
        (end >= item.start && end <= item.end)
      ) {
        return false;
      }
      return true;
    } else {
      return true;
    }
  });
  return isValid;
}

// 获取mxgraph 的属性数据
export function getAttributeData(value) {
  if (!mxUtils.isNode(value)) {
    return {};
  }
  const attrList = value.attributes;
  const attr = {};
  for (var i = 0; i < attrList.length; i++) {
    attr[attrList[i].nodeName] = attrList[i].nodeValue;
  }
  return attr;
}

export function updateDevcieById(id, data) {
  deviceMap.value[id] = { ...deviceMap.value[id], ...data };
}

export function updateCabinetById(id, data) {
  let cabinetData = cabinet.list.find((item) => item.id === id);
  if (cabinetData) {
    cabinetData.x = data.x;
    cabinetData.y = data.y;
  } else {
    console.log(id, data, cabinet.list);
  }
}
