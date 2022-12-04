import mxgraph, { getGraph } from "@/mxgraph";
const { mxUtils, mxConstants } = mxgraph;

// 更改字体样式 粗体 、 斜体 、下划线
export const toggleFontStyle = function (style) {
  const graph = getGraph();
  graph.stopEditing(false);

  graph.getModel().beginUpdate();
  try {
    var cells = graph.getSelectionCells();
    graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, style, cells);

    for (var i = 0; i < cells.length; i++) {
      if (graph.model.getChildCount(cells[i]) == 0) {
        graph.autoSizeCell(cells[i], false);
      }
    }
  } finally {
    graph.getModel().endUpdate();
  }
};
