import mxgraph from "@/mxgraph";
import "./mxDevice.js";
import "./mxPlaceCabinet.js";
import "./mxCabinet.js";

import {
  cabinetInterval,
  cabinetWidth,
  cabinetHeight,
  cellHeight,
  attrWidth,
  attrs,
  titleWidth,
  unitWidth,
  attrUnitWidth,
} from "./config";
console.log(cabinetWidth, cabinetHeight);
const { mxUtils, mxCell, mxGeometry } = mxgraph;

export function createDevice(data = {}) {
  var doc = mxUtils.createXmlDocument();
  var node = doc.createElement("设备");
  const device = new mxCell(
    node,
    new mxGeometry(0, 0, attrWidth, cellHeight),
    "shape=mxgraph.cabinetLayout.device;"
  );
  device.vertex = true;

  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    const attrDevice = new mxCell(
      data[attr.prop],
      new mxGeometry(
        titleWidth + unitWidth + i * attrUnitWidth,
        0,
        attrUnitWidth,
        cellHeight
      ),
      "shape=rect;fillColor=#ffffff;constituent=1;"
    );
    attrDevice.vertex = true;
    device.insert(attrDevice);
  }

  return device;
}

export function createPlaceCabinet(data) {
  var doc = mxUtils.createXmlDocument();
  var node = doc.createElement("div");

  let coord = { x: 0, y: 0 };
  if (typeof data === "object") {
    setAttributes(node, data);
    const { x = 0, y = 0 } = data;
    coord = getCabinetNewCoord(x, y);
  }

  const placeCabinet = new mxCell(
    node,
    new mxGeometry(coord.x, coord.y, cabinetWidth, cabinetHeight),
    "shape=mxgraph.cabinetLayout.placeCabinet;"
  );
  placeCabinet.vertex = true;
  return placeCabinet;
}

export function createCabinet(data) {
  var doc = mxUtils.createXmlDocument();
  var node = doc.createElement("机柜");
  const placeCabinet = new mxCell(
    node,
    new mxGeometry(0, 0, cabinetWidth, cabinetHeight),
    "shape=mxgraph.cabinetLayout.cabinet;"
  );
  placeCabinet.vertex = true;
  return placeCabinet;
}

function setAttributes(node, data) {
  if (!data) return;

  for (let [key, value] of Object.entries(data)) {
    node.setAttribute(key, value);
  }
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
