<template>
  <div id="graphContainer"></div>
</template>

<script>
import mxgraph from "@/mxgraph";
const { mxClient, mxUtils, mxEvent, mxGraph, mxRubberband } = mxgraph;
export default {
  mounted() {
    this.main(document.getElementById("graphContainer"));
  },
  methods: {
    main(container) {
      // Checks if the browser is supported
      if (!mxClient.isBrowserSupported()) {
        // Displays an error message if the browser is not supported.
        mxUtils.error("Browser is not supported!", 200, false);
      } else {
        // Disables the built-in context menu
        mxEvent.disableContextMenu(container);

        // Creates the graph inside the given container
        var graph = new mxGraph(container);

        // Enables rubberband selection
        new mxRubberband(graph);

        // Gets the default parent for inserting new cells. This
        // is normally the first child of the root (ie. layer 0).
        var parent = graph.getDefaultParent();

        // Adds cells to the model in a single step
        graph.getModel().beginUpdate();
        try {
          var v1 = graph.insertVertex(parent, null, "Hello,", 20, 20, 80, 30);
          var v2 = graph.insertVertex(parent, null, "World!", 200, 150, 80, 30);
          graph.insertEdge(parent, null, "", v1, v2);
        } finally {
          // Updates the display
          graph.getModel().endUpdate();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#graphContainer {
  position: relative;
  overflow: hidden;
  width: 321px;
  height: 241px;
  background: url("../assets/images/grid.gif");
  cursor: default;
  touch-action: none;
}
</style>
