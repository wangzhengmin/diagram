<template>
  <div class="w-format-sidebar">
    <p class="w-format-sidebar-title">样式格式侧边栏</p>
    <GlobalFormat v-show="formatModel === 'GlobalFormat'" />
    <CellFormat v-show="formatModel === 'CellFormat'" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import CellFormat from "./CellFormat.vue";
import GlobalFormat from "./GlobalFormat.vue";
import mxgraph, { getGraph } from "@/mxgraph";

const { mxUtils, mxEvent } = mxgraph;
const formatModel = ref("GlobalFormat");
let pendingRefresh;
const refresh = () => {
  if (pendingRefresh != null) {
    window.clearTimeout(pendingRefresh);
    pendingRefresh = null;
  }

  pendingRefresh = window.setTimeout(
    mxUtils.bind(this, function () {
      const graph = getGraph();
      if (graph.isSelectionEmpty()) {
        formatModel.value = "GlobalFormat";
      } else {
        formatModel.value = "CellFormat";
      }
    })
  );
};

const update = mxUtils.bind(this, function (sender, evt) {
  refresh();
});

onMounted(() => {
  const graph = getGraph();
  graph.getSelectionModel().addListener(mxEvent.CHANGE, update);
  graph.getModel().addListener(mxEvent.CHANGE, update);
  graph.addListener(mxEvent.EDITING_STARTED, update);
  graph.addListener(mxEvent.EDITING_STOPPED, update);
  graph.getView().addListener("unitChanged", update);
  graph.addListener(mxEvent.ROOT, update);
});
</script>

<style lang="scss" scoped>
.w-format-sidebar {
  flex: 0 0 auto;
  width: 240px;
  margin-right: 20px;
  border: 1px solid #dadce0;
  .w-format-sidebar-title {
    text-align: center;
    line-height: 30px;
    border-bottom: 1px solid #dadce0;
  }
}
</style>
