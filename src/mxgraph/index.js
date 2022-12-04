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

const {
  mxClient,
  mxUtils,
  mxEvent,
  mxGraph,
  mxRubberband,
  mxChildChange,
  mxUndoManager,
} = mxgraph;

const createUndoManager = (graph) => {
  var undoMgr = new mxUndoManager();

  const undoListener = function (sender, evt) {
    undoMgr.undoableEditHappened(evt.getProperty("edit"));
  };

  // Installs the command history
  const listener = mxUtils.bind(this, function (sender, evt) {
    undoListener.apply(this, arguments);
  });

  graph.getModel().addListener(mxEvent.UNDO, listener);
  graph.getView().addListener(mxEvent.UNDO, listener);

  return undoMgr;
};

let graph = null;
export const generateGraph = (container) => {
  graph = new mxGraph(container);
  const undoManager = createUndoManager(graph);
  graph.undoManager = undoManager;
  return graph;
};

export const getGraph = () => graph;

export default mxgraph;
