mxGraph.prototype.useScrollbarsForPanning = true;
mxGraph.prototype.pageBreaksVisible = true;
mxGraph.prototype.preferPageSize = true;
mxGraph.prototype.pageVisible = true;
mxGraph.prototype.pageFormat = mxConstants.PAGE_FORMAT_A4_PORTRAIT;
// graph.view.gridColor = '#e0e0e0';

mxGraphView.prototype.gridSteps = 4;
mxGraphView.prototype.minGridSize = 4;
// mxGraphView.prototype.defaultGridColor = '#d0d0d0';
// mxGraphView.prototype.defaultDarkGridColor = '#6e6e6e';

mxGraph.prototype.getPagePadding = function () {
  return new mxPoint(0, 0);
};

mxGraph.prototype.getPageSize = function () {
  console.log("getPageSize", this.pageFormat);
  const size = this.pageVisible
    ? new mxRectangle(
        0,
        0,
        this.pageFormat.width * this.pageScale,
        this.pageFormat.height * this.pageScale
      )
    : this.scrollTileSize;

  return size;
};

mxGraph.prototype.getPageLayout = function () {
  var size = this.getPageSize();
  var bounds = this.getGraphBounds();
  console.log("getPageLayout", bounds);
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
};

var graphViewValidate = mxGraphView.prototype.validate;
mxGraphView.prototype.validate = function (cell) {
  if (this.graph.useCssTransforms) {
    this.graph.currentScale = this.scale;
    this.graph.currentTranslate.x = this.translate.x;
    this.graph.currentTranslate.y = this.translate.y;

    this.scale = 1;
    this.translate.x = 0;
    this.translate.y = 0;
  }

  graphViewValidate.apply(this, arguments);

  if (this.graph.useCssTransforms) {
    this.graph.updateCssTransform();

    this.scale = this.graph.currentScale;
    this.translate.x = this.graph.currentTranslate.x;
    this.translate.y = this.graph.currentTranslate.y;
  }
};

mxGraph.prototype.sizeDidChange = function () {
  var bounds = this.getGraphBounds();

  if (this.container != null) {
    var border = this.getBorder();

    var width = Math.max(0, bounds.x) + bounds.width + 2 * border;
    var height = Math.max(0, bounds.y) + bounds.height + 2 * border;

    if (this.minimumContainerSize != null) {
      width = Math.max(width, this.minimumContainerSize.width);
      height = Math.max(height, this.minimumContainerSize.height);
    }

    if (this.resizeContainer) {
      this.doResizeContainer(width, height);
    }

    if (this.preferPageSize || (!mxClient.IS_IE && this.pageVisible)) {
      var size = this.getPreferredPageSize(
        bounds,
        Math.max(1, width),
        Math.max(1, height)
      );

      if (size != null) {
        width = size.width * this.view.scale;
        height = size.height * this.view.scale;
      }
    }

    if (this.minimumGraphSize != null) {
      width = Math.max(width, this.minimumGraphSize.width * this.view.scale);
      height = Math.max(height, this.minimumGraphSize.height * this.view.scale);
    }

    width = Math.ceil(width);
    height = Math.ceil(height);

    if (this.dialect == mxConstants.DIALECT_SVG) {
      var root = this.view.getDrawPane().ownerSVGElement;

      if (root != null) {
        root.style.minWidth = Math.max(1, width) + "px";
        root.style.minHeight = Math.max(1, height) + "px";
        root.style.width = "100%";
        root.style.height = "100%";
      }
    } else {
      if (mxClient.IS_QUIRKS) {
        // Quirks mode does not support minWidth/-Height
        this.view.updateHtmlCanvasSize(Math.max(1, width), Math.max(1, height));
      } else {
        this.view.canvas.style.minWidth = Math.max(1, width) + "px";
        this.view.canvas.style.minHeight = Math.max(1, height) + "px";
      }
    }

    this.updatePageBreaks(this.pageBreaksVisible, width, height);
  }

  this.fireEvent(new mxEventObject(mxEvent.SIZE, "bounds", bounds));
};

mxGraphView.prototype.createSvgGrid = function (color) {
  var tmp = this.graph.gridSize * this.scale;

  while (tmp < this.minGridSize) {
    tmp *= 2;
  }

  var tmp2 = this.gridSteps * tmp;
	console.log("createSvgGrid---",tmp2)
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
};

mxGraphView.prototype.validateBackgroundStyles = function () {
  var graph = this.graph;
  var color =
    graph.background == null || graph.background == mxConstants.NONE
      ? graph.defaultPageBackgroundColor
      : graph.background;
  var gridColor =
    color != null && this.gridColor != color.toLowerCase()
      ? this.gridColor
      : "#ffffff";
  var image = "none";
  var position = "";

  if (graph.isGridEnabled()) {
    var phase = 10;

    if (mxClient.IS_SVG) {
      // Generates the SVG required for drawing the dynamic grid
      image = unescape(encodeURIComponent(this.createSvgGrid("#acacac")));
      image = window.btoa ? btoa(image) : Base64.encode(image, true);
      image = "url(" + "data:image/svg+xml;base64," + image + ")";
      phase = graph.gridSize * this.scale * this.gridSteps;
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
    graph.container.className = "geDiagramContainer geDiagramBackdrop";
    canvas.style.backgroundImage = "none";
    canvas.style.backgroundColor = "";
  } else {
    graph.container.className = "geDiagramContainer";
    canvas.style.backgroundPosition = position;
    canvas.style.backgroundColor = color;
    canvas.style.backgroundImage = image;
  }
};

mxGraphView.prototype.validateBackgroundPage = function () {
  console.log(
    "validateBackgroundStyles",
    graph.container != null,
    !graph.transparentBackground
  );
  var graph = this.graph;

  if (graph.container != null && !graph.transparentBackground) {
    if (graph.pageVisible) {
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
    } else if (this.backgroundPageShape != null) {
      this.backgroundPageShape.destroy();
      this.backgroundPageShape = null;
    }

    this.validateBackgroundStyles();
  }
};

mxGraphView.prototype.validateBackgroundPage = function () {
  var graph = this.graph;

  if (graph.container != null && !graph.transparentBackground) {
    if (graph.pageVisible) {
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

          // IE8 standards has known rendering issues inside mxWindow but not using shadow is worse.
          this.backgroundPageShape.isShadow = true;
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
    } else if (this.backgroundPageShape != null) {
      this.backgroundPageShape.destroy();
      this.backgroundPageShape = null;
    }

    this.validateBackgroundStyles();
  }
};

mxGraphView.prototype.scaleAndTranslate = function (scale, dx, dy) {
  var previousScale = this.scale;
  var previousTranslate = new mxPoint(this.translate.x, this.translate.y);

  if (this.scale != scale || this.translate.x != dx || this.translate.y != dy) {
    this.scale = scale;

    this.translate.x = dx;
    this.translate.y = dy;

    if (this.isEventsEnabled()) {
      console.log("scaleAndTranslate---viewStateChanged");
      this.viewStateChanged();
    }
  }

  this.fireEvent(
    new mxEventObject(
      mxEvent.SCALE_AND_TRANSLATE,
      "scale",
      scale,
      "previousScale",
      previousScale,
      "translate",
      this.translate,
      "previousTranslate",
      previousTranslate
    )
  );
};

mxGraphView.prototype.getGraphBounds = function () {
  var b = this.graphBounds;

  if (this.graph.useCssTransforms) {
		debugger;
    var t = this.graph.currentTranslate;
    var s = this.graph.currentScale;

    b = new mxRectangle(
      (b.x + t.x) * s,
      (b.y + t.y) * s,
      b.width * s,
      b.height * s
    );
  }
  console.log("getGraphBounds", b);
  return b;
};
