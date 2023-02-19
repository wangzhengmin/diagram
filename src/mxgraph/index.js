import mx from "mxgraph";
import initDefaultStyle from "./core/defaultStyle";
import initMxEvent from "./core/mxEventExtend";
const mxgraph = mx({
  mxImageBasePath: "../src/images",
  mxBasePath: "./mxgraph",
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

const {
  mxUtils,
  mxEvent,
  mxGraph,
  mxRectangle,
  mxGraphView,
  mxPoint,
  mxEventObject,
  mxRubberband,
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
  new mxRubberband(graph);
  const undoManager = createUndoManager(graph);
  graph.undoManager = undoManager;
  graph.container = container;
  return graph;
};

let temporaryGraph;
export function createTemporaryGraph() {
  var graph = new mxGraph(document.createElement("div"));
  graph.resetViewOnRootChange = false;
  graph.setConnectable(false);
  graph.gridEnabled = false;
  graph.autoScroll = false;
  graph.setTooltips(false);
  graph.setEnabled(false);

  // Container must be in the DOM for correct HTML rendering
  graph.container.style.visibility = "hidden";
  graph.container.style.position = "absolute";
  graph.container.style.overflow = "hidden";
  graph.container.style.height = "1px";
  graph.container.style.width = "1px";

  temporaryGraph = graph;

  return graph;
}

export const getTemporaryGraph = () => {
  return temporaryGraph;
};

export const getGraph = () => graph;

setTimeout(() => {
  initMxEvent();
});

initDefaultStyle(mxgraph);

export default mxgraph;
// initMxEvent(mxEvent);
