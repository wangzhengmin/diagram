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
  theadHeight,
} from "./config";
const {
  mxUtils,
  mxEvent,
  mxRectangleShape,
  mxConstants,
  mxCellHighlight,
  mxCell,
  mxGeometry,
} = mxgraph;

export function createDevice(id, data = {}, isLegend = false) {
  var doc = mxUtils.createXmlDocument();
  var node = doc.createElement("div");
  node.setAttribute("label", "设备");
  const { start = 1, end = 1 } = data;
  const unit = end - start + 1;

  let coord = { x: 0, y: 0 };
  if (!isLegend) {
    coord = getDeviceNewCoord(start, end);
  }

  const device = new mxCell(
    node,
    new mxGeometry(coord.x, coord.y, attrWidth, cellHeight * unit),
    "shape=mxgraph.cabinetLayout.device;resizable=0;fillColor=#e1d5e7;"
  );
  device.vertex = true;
  id = id || Date.now();
  device.id = id;
  setAttributes(node, { ...data, id });

  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    const attrDevice = new mxCell(
      data[attr.prop] + "", // 注意要是字符串，不然可能显示不了
      new mxGeometry(
        titleWidth + unitWidth + i * attrUnitWidth,
        0,
        attrUnitWidth,
        cellHeight * unit
      ),
      "shape=rect;fillColor=#fff2cc;constituent=1;"
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
    "shape=mxgraph.cabinetLayout.placeCabinet;;resizable=0;"
  );
  placeCabinet.vertex = true;
  return placeCabinet;
}

export function createCabinet(id, data = {}) {
  var doc = mxUtils.createXmlDocument();
  var node = doc.createElement("div");
  node.setAttribute("label", "机柜");
  const { x = 0, y = 0 } = data;
  const coord = getCabinetNewCoord(x, y);

  const cabinet = new mxCell(
    node,
    new mxGeometry(coord.x, coord.y, cabinetWidth, cabinetHeight),
    "shape=mxgraph.cabinetLayout.cabinet;resizable=0;"
  );
  cabinet.vertex = true;
  id = id || Date.now();
  cabinet.id = id;
  setAttributes(node, { ...data, id });
  return cabinet;
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

// 根据x，y获取机柜的坐标
export function getDeviceNewCoord(start, end) {
  const newX = unitWidth;
  const newY = (start - 1) * cellHeight + theadHeight;
  return {
    x: newX,
    y: newY,
  };
}

// 改写机柜高亮样式
const originCellHighlight = mxCellHighlight.prototype.createShape;
mxCellHighlight.prototype.createShape = function () {
  let shape;
  if (this.state.style.shape === "mxgraph.cabinetLayout.cabinet") {
    shape = new mxRectangleShape();
    shape.svgStrokeTolerance = this.graph.tolerance;
    shape.points = this.state.absolutePoints;
    shape.apply(this.state);
    shape.stroke = this.highlightColor;
    shape.opacity = this.opacity;
    shape.isDashed = this.dashed;
    shape.isShadow = false;

    shape.dialect =
      this.graph.dialect != mxConstants.DIALECT_SVG
        ? mxConstants.DIALECT_VML
        : mxConstants.DIALECT_SVG;
    shape.init(this.graph.getView().getOverlayPane());
    mxEvent.redirectMouseEvents(shape.node, this.graph, this.state);

    if (this.graph.dialect != mxConstants.DIALECT_SVG) {
      shape.pointerEvents = false;
    } else {
      shape.svgPointerEvents = "stroke";
    }
  } else {
    shape = originCellHighlight.apply(this, arguments);
  }
  return shape;
};
