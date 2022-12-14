<template>
  <div id="graphContainer" tabindex="1"></div>
</template>

<script setup>
import mxgraph, { generateGraph, getGraph } from "../../mxgraph";
import Base64 from "base64";
import { onMounted } from "vue";
const GRAPH_CONFIG = {
  pageInfo: "a4",
  gridSize: 10,
  gridEnabled: true,
  gridSteps: 5,
  minGridSize: 1,
  scale: 1.0,
  gridColor: "#acacac",
  gridBackgroundEnabled: true,
  gridBackgroundColor: "#ffffff",
};
const {
  mxMouseEvent,
  mxClient,
  mxEvent,
  mxRectangle,
  mxPoint,
  mxRubberband,
  mxUtils,
  mxConstants,
  mxKeyHandler,
  mxPanningHandler,
  mxGraph,
} = mxgraph;
mxGraph.prototype.gridSteps = 5;

const resetScrollbars = () => {
  const graph = getGraph();
  let pad = graph.getPagePadding();
  let bounds = graph.getGraphBounds();
  graph.container.scrollTop = Math.floor(pad.y) - 1;
  graph.container.scrollLeft =
    Math.floor(
      Math.min(
        pad.x,
        (graph.container.scrollWidth - graph.container.clientWidth) / 2
      )
    ) - 1;

  if (bounds.width > 0 && bounds.height > 0) {
    if (
      bounds.x >
      graph.container.scrollLeft + graph.container.clientWidth * 0.9
    ) {
      graph.container.scrollLeft = Math.min(
        bounds.x + bounds.width - graph.container.clientWidth,
        bounds.x - 10
      );
    }
    if (
      bounds.y >
      graph.container.scrollTop + graph.container.clientHeight * 0.9
    ) {
      graph.container.scrollTop = Math.min(
        bounds.y + bounds.height - graph.container.clientHeight,
        bounds.y - 10
      );
    }
  }
};

const render = () => {
  const container = document.getElementById("graphContainer");
  // 禁用默认菜单
  mxEvent.disableContextMenu(container);
  const graph = generateGraph(container);
  new mxRubberband(graph);
  graph.tolerance = 12;
  graph.autoScroll = false;
  graph.pageBreaksVisible = true;
  graph.pageBreakColor = "none";

  graph.pageScale = GRAPH_CONFIG["scale"];
  graph.gridSize = GRAPH_CONFIG["gridSize"];
  graph.gridEnabled = GRAPH_CONFIG["gridEnabled"];
  graph.gridSteps = 5;

  graph.setPanning(true);
  graph.pageFormat = new mxRectangle(0, 0, 1189, 841);

  // graph.scrollTileSize = new mxRectangle(0, 0, 400, 400);

  // ok
  graph.getPagePadding = function () {
    return new mxPoint(
      Math.max(0, Math.round(graph.container.offsetWidth - 34)),
      Math.max(0, Math.round(graph.container.offsetHeight - 34))
    );
  };

  // ok
  graph.getPageSize = function () {
    return new mxRectangle(
      0,
      0,
      this.pageFormat.width * this.pageScale,
      this.pageFormat.height * this.pageScale
    );
  };

  /**
   * Returns a rectangle describing the position and count of the
   * background pages, where x and y are the position of the top,
   * left page and width and height are the vertical and horizontal
   * page count.
   */
  graph.getPageLayout = function () {
    var size = this.getPageSize();
    var bounds = this.getGraphBounds();
    if (bounds.width == 0 || bounds.height == 0) {
      return new mxRectangle(0, 0, 1, 1);
    } else {
      // Computes untransformed graph bounds
      var x = Math.ceil(bounds.x / this.view.scale - this.view.translate.x);
      var y = Math.ceil(bounds.y / this.view.scale - this.view.translate.y);
      var w = Math.floor(bounds.width / this.view.scale);
      var h = Math.floor(bounds.height / this.view.scale);

      var x0 = Math.floor(x / size.width);
      var y0 = Math.floor(y / size.height);
      var w0 = Math.ceil((x + w) / size.width) - x0;
      var h0 = Math.ceil((y + h) / size.height) - y0;

      return new mxRectangle(x0, y0, w0, h0);
    }
  };

  // Fits the number of background pages to the graph
  graph.view.getBackgroundPageBounds = function () {
    var layout = graph.getPageLayout();
    var page = graph.getPageSize();
    return new mxRectangle(
      this.scale * (this.translate.x + layout.x * page.width),
      this.scale * (this.translate.y + layout.y * page.height),
      this.scale * layout.width * page.width,
      this.scale * layout.height * page.height
    );
  };

  graph.getPreferredPageSize = function (bounds, width, height) {
    var pages = this.getPageLayout();
    var size = this.getPageSize();

    return new mxRectangle(
      0,
      0,
      pages.width * size.width,
      pages.height * size.height
    );
  };

  /**
   * Guesses autoTranslate to avoid another repaint (see below).
   * Works if only the scale of the graph changes or if pages
   * are visible and the visible pages do not change.
   */
  var graphViewValidate = graph.view.validate;
  graph.view.validate = function () {
    if (graph.container != null && mxUtils.hasScrollbars(graph.container)) {
      var pad = graph.getPagePadding();
      var size = graph.getPageSize();
      // Updating scrollbars here causes flickering in quirks and is not needed
      // if zoom method is always used to set the current scale on the graph.
      var tx = this.translate.x;
      var ty = this.translate.y;
      this.translate.x = pad.x / this.scale - (this.x0 || 0) * size.width;
      this.translate.y = pad.y / this.scale - (this.y0 || 0) * size.height;
    }

    graphViewValidate.apply(this, arguments);
  };

  var graphSizeDidChange = graph.sizeDidChange;
  graph.sizeDidChange = function () {
    if (this.container != null && mxUtils.hasScrollbars(this.container)) {
      var pages = this.getPageLayout();
      var pad = this.getPagePadding();
      var size = this.getPageSize();

      // Updates the minimum graph size
      var minw = Math.ceil(
        (2 * pad.x) / this.view.scale + pages.width * size.width
      );
      var minh = Math.ceil(
        (2 * pad.y) / this.view.scale + pages.height * size.height
      );

      var min = graph.minimumGraphSize;

      // LATER: Fix flicker of scrollbar size in IE quirks mode
      // after delayed call in window.resize event handler
      if (min == null || min.width != minw || min.height != minh) {
        graph.minimumGraphSize = new mxRectangle(0, 0, minw, minh);
      }

      // Updates auto-translate to include padding and graph size
      var dx = pad.x / this.view.scale - pages.x * size.width;
      var dy = pad.y / this.view.scale - pages.y * size.height;

      if (
        !this.autoTranslate &&
        (this.view.translate.x != dx || this.view.translate.y != dy)
      ) {
        this.autoTranslate = true;
        this.view.x0 = pages.x;
        this.view.y0 = pages.y;

        // NOTE: THIS INVOKES THIS METHOD AGAIN. UNFORTUNATELY THERE IS NO WAY AROUND THIS SINCE THE
        // BOUNDS ARE KNOWN AFTER THE VALIDATION AND SETTING THE TRANSLATE TRIGGERS A REVALIDATION.
        // SHOULD MOVE TRANSLATE/SCALE TO VIEW.
        var tx = graph.view.translate.x;
        var ty = graph.view.translate.y;

        graph.view.setTranslate(dx, dy);
        graph.container.scrollLeft += (dx - tx) * graph.view.scale;
        graph.container.scrollTop += (dy - ty) * graph.view.scale;

        this.autoTranslate = false;
        return;
      }

      graphSizeDidChange.apply(this, arguments);
    }
  };

  graph.view.createSvgGrid = function (color) {
    var tmp = this.graph.gridSize * this.scale;

    while (tmp < this.minGridSize) {
      tmp *= 2;
    }

    var tmp2 = GRAPH_CONFIG.gridSteps * tmp;
    // Small grid lines
    var d = [];

    for (var i = 1; i < GRAPH_CONFIG.gridSteps; i++) {
      var tmp3 = i * tmp;
      d.push(
        "M 0 " +
          tmp3 +
          " L " +
          tmp2 +
          " " +
          tmp3 +
          " M " +
          tmp3 +
          " 0 L " +
          tmp3 +
          " " +
          tmp2
      );
    }
    // KNOWN: Rounding errors for certain scales (eg. 144%, 121% in Chrome, FF and Safari). Workaround
    // in Chrome is to use 100% for the svg size, but this results in blurred grid for large diagrams.
    var size = tmp2;
    var svg =
      '<svg width="' +
      size +
      '" height="' +
      size +
      '" xmlns="' +
      mxConstants.NS_SVG +
      '">' +
      '<defs><pattern id="grid" width="' +
      tmp2 +
      '" height="' +
      tmp2 +
      '" patternUnits="userSpaceOnUse">' +
      '<path d="' +
      d.join(" ") +
      '" fill="none" stroke="' +
      color +
      '" opacity="0.2" stroke-width="1"/>' +
      '<path d="M ' +
      tmp2 +
      " 0 L 0 0 0 " +
      tmp2 +
      '" fill="none" stroke="' +
      color +
      '" stroke-width="1"/>' +
      '</pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>';
    return svg;
  };

  graph.view.validateBackgroundStyles = function () {
    var graph = this.graph;
    var color =
      graph.background == null || graph.background == mxConstants.NONE
        ? graph.defaultPageBackgroundColor
        : graph.background;
    var gridColor = "#acacac";
    var image = "none";
    var position = "";

    if (graph.isGridEnabled()) {
      var phase = 10;

      if (mxClient.IS_SVG) {
        // Generates the SVG required for drawing the dynamic grid
        image = unescape(encodeURIComponent(this.createSvgGrid(gridColor)));
        image = window.btoa ? btoa(image) : Base64.encode(image, true);
        image = "url(" + "data:image/svg+xml;base64," + image + ")";
        phase = graph.gridSize * this.scale * GRAPH_CONFIG.gridSteps;
      } else {
        // Fallback to grid wallpaper with fixed size
        image = "url(" + this.gridImage + ")";
      }

      var x0 = 0;
      var y0 = 0;

      if (graph.view.backgroundPageShape != null) {
        var bds = this.getBackgroundPageBounds();

        x0 = 1 + bds.x;
        y0 = 1 + bds.y;
      }

      // Computes the offset to maintain origin for grid
      position =
        -Math.round(
          phase - mxUtils.mod(this.translate.x * this.scale - x0, phase)
        ) +
        "px " +
        -Math.round(
          phase - mxUtils.mod(this.translate.y * this.scale - y0, phase)
        ) +
        "px";
    }

    var canvas = graph.view.canvas;

    if (canvas.ownerSVGElement != null) {
      canvas = canvas.ownerSVGElement;
    }

    if (graph.view.backgroundPageShape != null) {
      graph.view.backgroundPageShape.node.style.backgroundPosition = position;
      graph.view.backgroundPageShape.node.style.backgroundImage = image;
      graph.view.backgroundPageShape.node.style.backgroundColor = color;
      canvas.style.backgroundImage = "none";
      canvas.style.backgroundColor = "";
    } else {
      canvas.style.backgroundPosition = position;
      canvas.style.backgroundColor = color;
      canvas.style.backgroundImage = image;
    }
  };
  graph.view.validateBackgroundPage = function () {
    var graph = this.graph;

    if (graph.container != null && !graph.transparentBackground) {
      var bounds = this.getBackgroundPageBounds();

      if (this.backgroundPageShape == null) {
        // Finds first element in graph container
        var firstChild = graph.container.firstChild;

        while (
          firstChild != null &&
          firstChild.nodeType != mxConstants.NODETYPE_ELEMENT
        ) {
          firstChild = firstChild.nextSibling;
        }

        if (firstChild != null) {
          this.backgroundPageShape = this.createBackgroundPageShape(bounds);
          this.backgroundPageShape.scale = 1;

          // Shadow filter causes problems in outline window in quirks mode. IE8 standards
          // also has known rendering issues inside mxWindow but not using shadow is worse.
          this.backgroundPageShape.isShadow = !mxClient.IS_QUIRKS;
          this.backgroundPageShape.dialect = mxConstants.DIALECT_STRICTHTML;
          this.backgroundPageShape.init(graph.container);

          // Required for the browser to render the background page in correct order
          firstChild.style.position = "absolute";
          graph.container.insertBefore(
            this.backgroundPageShape.node,
            firstChild
          );
          this.backgroundPageShape.redraw();

          this.backgroundPageShape.node.className = "geBackgroundPage";

          // Adds listener for double click handling on background
          mxEvent.addListener(
            this.backgroundPageShape.node,
            "dblclick",
            mxUtils.bind(this, function (evt) {
              graph.dblClick(evt);
            })
          );

          // Adds basic listeners for graph event dispatching outside of the
          // container and finishing the handling of a single gesture
          mxEvent.addGestureListeners(
            this.backgroundPageShape.node,
            mxUtils.bind(this, function (evt) {
              graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt));
            }),
            mxUtils.bind(this, function (evt) {
              // Hides the tooltip if mouse is outside container
              if (
                graph.tooltipHandler != null &&
                graph.tooltipHandler.isHideOnHover()
              ) {
                graph.tooltipHandler.hide();
              }

              if (graph.isMouseDown && !mxEvent.isConsumed(evt)) {
                graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt));
              }
            }),
            mxUtils.bind(this, function (evt) {
              graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt));
            })
          );
        }
      } else {
        this.backgroundPageShape.scale = 1;
        this.backgroundPageShape.bounds = bounds;
        this.backgroundPageShape.redraw();
      }

      this.validateBackgroundStyles();
    }
  };

  // Enables rubberband selection

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();
  graph.view.validate();
  console.log(graph);
  resetScrollbars();
  // Adds cells to the model in a single step
  graph.getModel().beginUpdate();
  try {
    var v1 = graph.insertVertex(parent, null, "Hello,", 20, 20, 80, 30);
    var v2 = graph.insertVertex(parent, null, "World!", 200, 150, 80, 30);
    var e1 = graph.insertEdge(parent, null, "", v1, v2);
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }
};

onMounted(() => {
  render();
});
</script>

<style lang="scss" scoped>
#graphContainer {
  background: #efefef;
  outline: none;
  position: relative;
  overflow: auto;
  width: 100%;
  height: 100%;
}

// #graphContainer {
//   position: relative;
//   overflow: auto;
//   width: 321px;
//   height: 241px;

//   cursor: default;
// }
</style>
