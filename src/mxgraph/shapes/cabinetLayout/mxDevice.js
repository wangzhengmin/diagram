import mxgraph from "@/mxgraph";
import { attrLen, attrUnitWidth, unitWidth, titleWidth } from "./config";
const { mxShape, mxUtils, mxCellRenderer, mxRectangle } = mxgraph;

function mxDevice(bounds, fill, stroke, strokewidth) {
  mxShape.call(this);
  this.bounds = bounds;
  this.fill = fill;
  this.stroke = stroke;
  this.strokewidth = strokewidth != null ? strokewidth : 1;
}

mxUtils.extend(mxDevice, mxShape);

mxDevice.prototype.unitSize = 20;

mxDevice.prototype.paintVertexShape = function (c, x, y, w, h) {
  c.translate(x, y);
  c.setFillColor("#ffffff");
  this.background(c, w, h);
  this.sideGrid(c, w, h);
};

mxDevice.prototype.background = function (c, w, h) {
  c.rect(0, 0, titleWidth, h);
  c.fillAndStroke();
};

mxDevice.prototype.sideGrid = function (c, w, h) {
  c.begin();

  c.moveTo(titleWidth + unitWidth, 0);
  c.lineTo(w, 0);

  c.moveTo(titleWidth + unitWidth, h);
  c.lineTo(w, h);

  c.moveTo(titleWidth, 0);
  c.lineTo(titleWidth, h);

  c.moveTo(titleWidth + unitWidth, 0);
  c.lineTo(titleWidth + unitWidth, h);
  for (let i = 0; i < attrLen + 1; i++) {
    c.moveTo(titleWidth + unitWidth + i * attrUnitWidth, 0);
    c.lineTo(titleWidth + unitWidth + i * attrUnitWidth, h);
  }
  c.stroke();
};

mxDevice.prototype.getLabelBounds = function (rect) {
  var bounds = new mxRectangle(rect.x, rect.y, titleWidth, rect.height);
  return bounds;
};

mxCellRenderer.registerShape("mxgraph.cabinetLayout.device", mxDevice);
