export default function initDefaultStyle(mxgraph) {
  const { mxConstants } = mxgraph;
  console.log("here", mxConstants);
  mxConstants.HANDLE_FILLCOLOR = "#29b6f2";
  mxConstants.HANDLE_STROKECOLOR = "#0088cf";

  // 图形选中时的边框颜色、宽度
  mxConstants.VERTEX_SELECTION_COLOR = "#00a8ff";
  mxConstants.VERTEX_SELECTION_STROKEWIDTH = 2;
  mxConstants.VERTEX_SELECTION_DASHED = false;
  // 连线选中时的颜色
  mxConstants.EDGE_SELECTION_COLOR = "#00a8ff";
  // mxConstants.OUTLINE_COLOR = "#00a8ff";
  // mxConstants.OUTLINE_HANDLE_FILLCOLOR = "#99ccff";
  // mxConstants.OUTLINE_HANDLE_STROKECOLOR = "#00a8ff";
  // mxConstants.CONNECT_HANDLE_FILLCOLOR = "#cee7ff";
  // mxConstants.EDGE_SELECTION_COLOR = "#00a8ff";
  // mxConstants.DEFAULT_VALID_COLOR = "#00a8ff";
  // mxConstants.LABEL_HANDLE_FILLCOLOR = "#cee7ff";
  // mxConstants.GUIDE_COLOR = "#0088cf";
  // 高亮的透明度
  mxConstants.HIGHLIGHT_OPACITY = 30;
  // mxConstants.HIGHLIGHT_SIZE = 5;
}
