import mxgraph, { getGraph } from "@/mxgraph";
const { mxClient, mxUtils } = mxgraph;

export const CtrlKey = mxClient.IS_MAC ? "Cmd" : "Ctrl";

export const createStyleChangeFunction = function (keys, values) {
  return mxUtils.bind(this, function (post) {
    var graph = getGraph();
    graph.stopEditing(false);

    graph.getModel().beginUpdate();
    try {
      var cells = graph.getSelectionCells();

      for (var i = 0; i < keys.length; i++) {
        graph.setCellStyles(keys[i], values[i], cells);
      }
    } finally {
      graph.getModel().endUpdate();
    }
  });
};
