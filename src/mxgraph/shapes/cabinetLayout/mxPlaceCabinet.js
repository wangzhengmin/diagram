import mxgraph from "@/mxgraph";
const { mxShape, mxUtils, mxCellRenderer } = mxgraph;

function mxPlaceCabinet(bounds, fill, stroke, strokewidth) {
  mxShape.call(this);
  this.bounds = bounds;
  this.fill = fill;
  this.stroke = stroke;
  this.strokewidth = strokewidth != null ? strokewidth : 1;
}

mxUtils.extend(mxPlaceCabinet, mxShape);

mxPlaceCabinet.prototype.paintVertexShape = function (c, x, y, w, h) {
  c.translate(x, y);
  c.setFillColor("#ffffff");
  this.background(c, w, h);
  this.foreground(c, w, h);
};

mxPlaceCabinet.prototype.background = function (c, w, h) {
  c.rect(0, 0, w, h);
  c.fillAndStroke();
};

mxPlaceCabinet.prototype.foreground = function (c, w, h) {
  const strokeWidth = 4;
  c.begin();

  c.setStrokeWidth(strokeWidth);
  c.setStrokeColor("#aaaaaa");
  c.moveTo(w * 0.2, h * 0.5 - strokeWidth / 2);
  c.lineTo(w * 0.8, h * 0.5 - strokeWidth / 2);

  c.moveTo(w * 0.5 - strokeWidth / 2, h * 0.3 - strokeWidth / 2);
  c.lineTo(w * 0.5 - strokeWidth / 2, h * 0.7 - strokeWidth / 2);

  c.stroke();
};

mxCellRenderer.registerShape(
  "mxgraph.cabinetLayout.placeCabinet",
  mxPlaceCabinet
);
