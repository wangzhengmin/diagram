<template>
  <div class="w-toolbar-view">
    <ToolbarContainer />
    <div id="graphContainer"></div>
  </div>
</template>

<script setup>
import mxgraph, { generateGraph } from "@/mxgraph";
import ToolbarContainer from "@/components/toolbar/ToolbarContainer.vue";
import { onMounted } from "vue";

const { mxClient, mxUtils, mxEvent, mxGraph, mxRubberband } = mxgraph;

const main = (container) => {
  // Checks if the browser is supported
  if (!mxClient.isBrowserSupported()) {
    // Displays an error message if the browser is not supported.
    mxUtils.error("Browser is not supported!", 200, false);
  } else {
    // Disables the built-in context menu
    mxEvent.disableContextMenu(container);

    // Creates the graph inside the given container
    var graph = generateGraph(container);
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
};

onMounted(() => {
  main(document.getElementById("graphContainer"));
});
</script>

<style scoped>
.w-toolbar-view {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
}
#graphContainer {
  flex: 1 1;
  background: url("../assets/images/grid.gif");
}
</style>
