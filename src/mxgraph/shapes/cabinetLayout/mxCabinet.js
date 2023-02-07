import mxgraph from "@/mxgraph";
const { mxShape, mxUtils, mxConstants, mxCellRenderer, mxRectangle } = mxgraph;
import {
  capacity,
  cols,
  attrUnitWidth,
  unitWidth,
  titleWidth,
  cellHeight,
  tfootHeight,
  theadHeight,
} from "./config";

function mxCabinet(bounds, fill, stroke, strokewidth) {
  mxShape.call(this);
  this.bounds = bounds;
  this.fill = fill;
  this.stroke = stroke;
  this.strokewidth = strokewidth != null ? strokewidth : 1;
}

mxUtils.extend(mxCabinet, mxShape);

mxCabinet.prototype.unitSize = 20;

mxCabinet.prototype.paintVertexShape = function (c, x, y, w, h) {
  c.translate(x, y);
  c.setFillColor("#ffffff");
  this.background(c, w, h);
  c.setShadow(false);
  c.setFillColor("#f4f4f4");
  this.tableGrid(c, w, h);
  this.tableText(c, w, h);
};

mxCabinet.prototype.background = function (c, w, h) {
  c.rect(0, 0, w, h);
  c.fillAndStroke();
};

mxCabinet.prototype.tableGrid = function (c, w, h) {
  c.begin();
  let sumHeight = 0;
  for (let i = 0; i < capacity + 1; i++) {
    if (i === 0) {
      sumHeight += theadHeight;
    } else if (i === capacity + 1) {
      sumHeight += tfootHeight;
    } else {
      sumHeight += cellHeight;
    }
    c.moveTo(0, sumHeight);
    c.lineTo(w, sumHeight);
  }
  c.stroke();

  c.begin();
  let sumWdith = 0;
  for (let i = 0; i < cols; i++) {
    if (i === 0 || i === 2) {
      sumWdith += unitWidth;
    } else if (i > 2) {
      sumWdith += attrUnitWidth;
    } else {
      sumWdith += titleWidth;
    }
    c.moveTo(sumWdith, 0);
    c.lineTo(sumWdith, h);
  }
  c.stroke();
};

mxCabinet.prototype.tableText = function (c, w, h) {
  const createUnitText = (startX, startY) => {
    for (var i = 0; i < capacity; i++) {
      c.text(
        startX + unitWidth / 2,
        startY + cellHeight * i + cellHeight / 2,
        0,
        0,
        `${i + 1}U`,
        mxConstants.ALIGN_CENTER,
        mxConstants.ALIGN_MIDDLE,
        0,
        null,
        0,
        0,
        0
      );
    }
  };
  createUnitText(0, theadHeight);
  createUnitText(unitWidth + titleWidth, theadHeight);
};

mxCabinet.prototype.getLabelBounds = function (rect) {
  var bounds = new mxRectangle(
    rect.x + unitWidth,
    rect.y,
    titleWidth,
    theadHeight
  );
  return bounds;
};

mxCellRenderer.registerShape("mxgraph.cabinetLayout.cabinet", mxCabinet);
