import mxgraph from "@/mxgraph/index.js";
const { mxCell, mxGeometry } = mxgraph;

function createVertexTemplate(style, width, height, value) {
  var cells = [
    new mxCell(
      value != null ? value : "",
      new mxGeometry(0, 0, width, height),
      style
    ),
  ];
  cells[0].vertex = true;
  return cells;
}

export const createVertexTemplateEntry = (
  style,
  width,
  height,
  value,
  title,
  showLabel,
  showTitle
) => {
  return createVertexTemplate(
    style,
    width,
    height,
    value,
    title,
    showLabel,
    showTitle
  );
};
