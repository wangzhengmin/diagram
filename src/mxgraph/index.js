import mx from "mxgraph";
const mxgraph = mx({
  mxImageBasePath: "../src/images",
  mxBasePath: "../src",
});

// decode bug https://github.com/jgraph/mxgraph/issues/49
window.mxGraph = mxgraph.mxGraph;
window.mxGraphModel = mxgraph.mxGraphModel;
window.mxEditor = mxgraph.mxEditor;
window.mxGeometry = mxgraph.mxGeometry;
window.mxDefaultKeyHandler = mxgraph.mxDefaultKeyHandler;
window.mxDefaultPopupMenu = mxgraph.mxDefaultPopupMenu;
window.mxStylesheet = mxgraph.mxStylesheet;
window.mxDefaultToolbar = mxgraph.mxDefaultToolbar;

mxgraph.mxGraphHandler.prototype.maxLivePreview = 16;

mxgraph.mxGraph.prototype.getMaximumGraphBounds = function () {
  return new mxgraph.mxRectangle(0, 0, 500, 198);
};

export default mxgraph;
