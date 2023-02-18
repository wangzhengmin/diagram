import mxgraph, { getGraph } from "../index";
import { isZoomWheelEvent, mxClient } from "./utils";

export default function initMxEvent() {
  const { mxEvent, mxUtils, mxPoint, mxClient } = mxgraph;
  const graph = getGraph();

  graph.cumulativeZoomFactor = 1;
  let updateZoomTimeout = null;
  let cursorPosition = null;

  function lazyZoom(zoomIn) {
    if (updateZoomTimeout !== null) {
      window.clearTimeout(updateZoomTimeout);
    }
    const zoomFactor = graph.zoomFactor;
    const scale = graph.view.scale;

    let cumulativeZoomFactor = 1;

    if (zoomIn) {
      if (scale * cumulativeZoomFactor < 0.15) {
        cumulativeZoomFactor = (scale + 0.01) / scale;
      } else {
        cumulativeZoomFactor *= zoomFactor;
        cumulativeZoomFactor =
          Math.round(scale * cumulativeZoomFactor * 20) / 20 / scale;
      }
    } else {
      if (scale * cumulativeZoomFactor <= 0.15) {
        cumulativeZoomFactor = (scale - 0.01) / scale;
      } else {
        cumulativeZoomFactor /= zoomFactor;
        cumulativeZoomFactor =
          Math.round(scale * cumulativeZoomFactor * 20) / 20 / scale;
      }
    }
    cumulativeZoomFactor = Math.max(
      0.01,
      Math.min(scale * cumulativeZoomFactor, 160) / scale
    );
    updateZoomTimeout = window.setTimeout(() => {
      const offset = mxUtils.getOffset(graph.container);
      let dx = 0;
      let dy = 0;

      if (cursorPosition !== null) {
        dx = graph.container.offsetWidth / 2 - cursorPosition.x + offset.x;
        dy = graph.container.offsetHeight / 2 - cursorPosition.y + offset.y;
      }
      const prev = graph.view.scale;

      graph.zoom(cumulativeZoomFactor);
      const s = graph.view.scale;
      if (s !== prev) {
        if (mxUtils.hasScrollbars(graph.container) && (dx !== 0 || dy !== 0)) {
          graph.container.scrollLeft -= dx * (cumulativeZoomFactor - 1);
          graph.container.scrollTop -= dy * (cumulativeZoomFactor - 1);
        }
      }
      updateZoomTimeout = null;
    }, 10);
  }

  // 滚动放大缩小
  mxEvent.addMouseWheelListener(
    mxUtils.bind(this, function (evt, up, force, cx, cy) {
      if (isZoomWheelEvent(evt)) {
        let source = mxEvent.getSource(evt);

        while (source != null) {
          if (source == graph.container) {
            graph.tooltipHandler.hideTooltip();
            lazyZoom(up);
            mxEvent.consume(evt);

            return false;
          }

          source = source.parentNode;
        }
      }
    }),
    graph.container
  );
}
