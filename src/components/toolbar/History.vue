<template>
  <a class="w-sprite w-sprite-undo" title="撤销" @click="undo"></a>
  <a class="w-sprite w-sprite-redo" title="重做" @click="redo"></a>
</template>

<script>
export default {
  name: "History",
};
</script>
<script setup>
import { getGraph } from "@/mxgraph";

const undo = () => {
  const graph = getGraph();
  if (graph.isEditing()) {
    // Stops editing and executes undo on graph if native undo
    // does not affect current editing value
    var value = graph.cellEditor.textarea.innerHTML;
    document.execCommand("undo", false, null);

    if (value == graph.cellEditor.textarea.innerHTML) {
      graph.stopEditing(true);
      graph.undoManager.undo();
    }
  } else {
    graph.undoManager.undo();
  }
};

const redo = () => {
  const graph = getGraph();
  if (graph.isEditing()) {
    document.execCommand("redo", false, null);
  } else {
    graph.undoManager.redo();
  }
};
</script>

<style></style>
