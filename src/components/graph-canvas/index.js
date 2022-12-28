import mxgraph, { getGraph } from "@/mxgraph";
import Base64 from "base64";
const {
  mxPoint,
  mxMouseEvent,
  mxEvent,
  mxRectangle,
  mxClient,
  mxUtils,
  mxEventObject,
  mxGraph,
  mxGraphView,
  mxConstants,
} = mxgraph;

/**
 * 初始化画布
 */
export function initCanvas() {
  const graph = getGraph();
  graph.pageVisible = true;
  graph.pageFormat = mxConstants.PAGE_FORMAT_A4_PORTRAIT;
  graph.view.gridSteps = 4;

  graph.view.validate = validate;
  graph.view.getGraphBounds = getGraphBounds;
  graph.view.getBackgroundPageBounds = getBackgroundPageBounds;
  graph.view.createSvgGrid = createSvgGrid;
  graph.view.validateBackgroundPage = validateBackgroundPage;
  graph.view.validateBackgroundStyles = validateBackgroundStyles;
  graph.getPagePadding = getPagePadding;
  graph.getPageSize = getPageSize;
  graph.getPageLayout = getPageLayout;
  graph.resetScrollbars = resetScrollbars;
  graph.sizeDidChange = sizeDidChange;
}

/**
 * 获取页面内边距
 */
function getPagePadding() {
  return new mxPoint(
    Math.max(
      0,
      Math.round((this.container.offsetWidth - 34) / this.view.scale)
    ),
    Math.max(
      0,
      Math.round((this.container.offsetHeight - 34) / this.view.scale)
    )
  );
}

/**
 * 获取页面尺寸
 */
function getPageSize() {
  const size = this.pageVisible
    ? new mxRectangle(
        0,
        0,
        this.pageFormat.width * this.pageScale,
        this.pageFormat.height * this.pageScale
      )
    : this.scrollTileSize;

  return size;
}

/**
 * 获取页面布局
 */
function getPageLayout() {
  var size = this.getPageSize();
  var bounds = this.getGraphBounds();
  if (bounds.width == 0 || bounds.height == 0) {
    return new mxRectangle(0, 0, 1, 1);
  } else {
    var x0 = Math.floor(
      Math.ceil(bounds.x / this.view.scale - this.view.translate.x) / size.width
    );
    var y0 = Math.floor(
      Math.ceil(bounds.y / this.view.scale - this.view.translate.y) /
        size.height
    );
    var w0 =
      Math.ceil(
        (Math.floor((bounds.x + bounds.width) / this.view.scale) -
          this.view.translate.x) /
          size.width
      ) - x0;
    var h0 =
      Math.ceil(
        (Math.floor((bounds.y + bounds.height) / this.view.scale) -
          this.view.translate.y) /
          size.height
      ) - y0;
    return new mxRectangle(x0, y0, w0, h0);
  }
}

/**
 * 获取画布范围
 */
function getGraphBounds() {
  var b = this.graphBounds;

  if (this.useCssTransforms) {
    var t = this.currentTranslate;
    var s = this.currentScale;

    b = new mxRectangle(
      (b.x + t.x) * s,
      (b.y + t.y) * s,
      b.width * s,
      b.height * s
    );
  }
  return b;
}

// 重置滚动条
function resetScrollbars() {
  var pad = this.getPagePadding();
  this.container.scrollTop = Math.floor(pad.y - 3) - 1;
  this.container.scrollLeft =
    Math.floor(
      Math.min(
        pad.x,
        (this.container.scrollWidth - this.container.clientWidth) / 2
      )
    ) - 1;

  // Scrolls this to visible area
  var bounds = this.getGraphBounds();

  if (bounds.width > 0 && bounds.height > 0) {
    if (
      bounds.x >
      this.container.scrollLeft + this.container.clientWidth * 0.9
    ) {
      this.container.scrollLeft = Math.min(
        bounds.x + bounds.width - this.container.clientWidth,
        bounds.x - 10
      );
    }

    if (
      bounds.y >
      this.container.scrollTop + this.container.clientHeight * 0.9
    ) {
      this.container.scrollTop = Math.min(
        bounds.y + bounds.height - this.container.clientHeight,
        bounds.y - 10
      );
    }
  }
}

/**
 * 创建页面背景格子
 */
function createSvgGrid(color) {
  var tmp = this.graph.gridSize * this.scale;

  while (tmp < this.minGridSize) {
    tmp *= 2;
  }

  var tmp2 = this.gridSteps * tmp;
  // Small grid lines
  var d = [];

  for (var i = 1; i < this.gridSteps; i++) {
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
}

/**
 * 添加背景图片
 */
function validateBackgroundStyles() {
  var color =
    this.graph.background == null || this.graph.background == mxConstants.NONE
      ? this.graph.defaultPageBackgroundColor
      : this.graph.background;
  var gridColor =
    color != null && this.gridColor != color.toLowerCase()
      ? this.gridColor
      : "#ffffff";
  var image = "none";
  var position = "";

  if (this.graph.isGridEnabled()) {
    var phase = 10;

    if (mxClient.IS_SVG) {
      // Generates the SVG required for drawing the dynamic grid
      image = unescape(encodeURIComponent(this.createSvgGrid("#acacac")));
      image = window.btoa ? btoa(image) : Base64.encode(image, true);
      image = "url(" + "data:image/svg+xml;base64," + image + ")";
      phase = this.graph.gridSize * this.scale * this.gridSteps;
    } else {
      // Fallback to grid wallpaper with fixed size
      image = "url(" + this.gridImage + ")";
    }

    var x0 = 0;
    var y0 = 0;

    if (this.graph.view.backgroundPageShape != null) {
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

  var canvas = this.graph.view.canvas;

  if (canvas.ownerSVGElement != null) {
    canvas = canvas.ownerSVGElement;
  }

  if (this.graph.view.backgroundPageShape != null) {
    this.graph.view.backgroundPageShape.node.style.backgroundPosition =
      position;
    this.graph.view.backgroundPageShape.node.style.backgroundImage = image;
    this.graph.view.backgroundPageShape.node.style.backgroundColor = color;
    this.graph.container.className = "geDiagramContainer geDiagramBackdrop";
    canvas.style.backgroundImage = "none";
    canvas.style.backgroundColor = "";
  } else {
    this.graph.container.className = "geDiagramContainer";
    canvas.style.backgroundPosition = position;
    canvas.style.backgroundColor = color;
    canvas.style.backgroundImage = image;
  }
}

/**
 * 验证是否需要背景
 */
function validateBackgroundPage() {
  if (this.graph.container != null && !this.graph.transparentBackground) {
    if (this.graph.pageVisible) {
      var bounds = this.getBackgroundPageBounds();

      if (this.backgroundPageShape == null) {
        // Finds first element in this.graph container
        var firstChild = this.graph.container.firstChild;

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
          this.backgroundPageShape.init(this.graph.container);

          // Required for the browser to render the background page in correct order
          firstChild.style.position = "absolute";
          this.graph.container.insertBefore(
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
              this.graph.dblClick(evt);
            })
          );

          // Adds basic listeners for this.graph event dispatching outside of the
          // container and finishing the handling of a single gesture
          mxEvent.addGestureListeners(
            this.backgroundPageShape.node,
            mxUtils.bind(this, function (evt) {
              this.graph.fireMouseEvent(
                mxEvent.MOUSE_DOWN,
                new mxMouseEvent(evt)
              );
            }),
            mxUtils.bind(this, function (evt) {
              // Hides the tooltip if mouse is outside container
              if (
                this.graph.tooltipHandler != null &&
                this.graph.tooltipHandler.isHideOnHover()
              ) {
                this.graph.tooltipHandler.hide();
              }

              if (this.graph.isMouseDown && !mxEvent.isConsumed(evt)) {
                this.graph.fireMouseEvent(
                  mxEvent.MOUSE_MOVE,
                  new mxMouseEvent(evt)
                );
              }
            }),
            mxUtils.bind(this, function (evt) {
              this.graph.fireMouseEvent(
                mxEvent.MOUSE_UP,
                new mxMouseEvent(evt)
              );
            })
          );
        }
      } else {
        this.backgroundPageShape.scale = 1;
        this.backgroundPageShape.bounds = bounds;
        this.backgroundPageShape.redraw();
      }
    } else if (this.backgroundPageShape != null) {
      this.backgroundPageShape.destroy();
      this.backgroundPageShape = null;
    }

    this.validateBackgroundStyles();
  }
}

/**
 * 获取背景图的范围
 */
function getBackgroundPageBounds() {
  var layout = this.graph.getPageLayout();
  var page = this.graph.getPageSize();

  return new mxRectangle(
    this.scale * (this.translate.x + layout.x * page.width),
    this.scale * (this.translate.y + layout.y * page.height),
    this.scale * layout.width * page.width,
    this.scale * layout.height * page.height
  );
}

var graphViewValidate = mxGraphView.prototype.validate;
function validate() {
  if (
    this.graph.container != null &&
    mxUtils.hasScrollbars(this.graph.container)
  ) {
    var pad = this.graph.getPagePadding();
    var size = this.graph.getPageSize();

    // Updating scrollbars here causes flickering in quirks and is not needed
    // if zoom method is always used to set the current scale on the this.graph.
    var tx = this.translate.x;
    var ty = this.translate.y;
    this.translate.x = pad.x - (this.x0 || 0) * size.width;
    this.translate.y = pad.y - (this.y0 || 0) * size.height;
  }

  graphViewValidate.apply(this, arguments);
}

var graphSizeDidChange = mxGraph.prototype.sizeDidChange;
function sizeDidChange() {
  if (this.container != null && mxUtils.hasScrollbars(this.container)) {
    var pages = this.getPageLayout();
    var pad = this.getPagePadding();
    var size = this.getPageSize();

    // Updates the minimum this.graph size
    var minw = Math.ceil(2 * pad.x + pages.width * size.width);
    var minh = Math.ceil(2 * pad.y + pages.height * size.height);

    var min = this.minimumGraphSize;

    // LATER: Fix flicker of scrollbar size in IE quirks mode
    // after delayed call in window.resize event handler
    if (min == null || min.width != minw || min.height != minh) {
      this.minimumGraphSize = new mxRectangle(0, 0, minw, minh);
    }

    // Updates auto-translate to include padding and this.graph size
    var dx = pad.x - pages.x * size.width;
    var dy = pad.y - pages.y * size.height;

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
      var tx = this.view.translate.x;
      var ty = this.view.translate.y;
      this.view.setTranslate(dx, dy);

      // LATER: Fix rounding errors for small zoom
      this.container.scrollLeft += Math.round((dx - tx) * this.view.scale);
      this.container.scrollTop += Math.round((dy - ty) * this.view.scale);

      this.autoTranslate = false;

      return;
    }

    graphSizeDidChange.apply(this, arguments);
  } else {
    // Fires event but does not invoke superclass
    this.fireEvent(
      new mxEventObject(mxEvent.SIZE, "bounds", this.getGraphBounds())
    );
  }
}
