<template>
  <p>画布大小</p>
  <span>宽：</span>
  <input type="number" v-model="width" />
  <span>高：</span>
  <input type="number" v-model="height" />
  <div
    id="graphContainer"
    :style="{ width: width + 'px', height: height + 'px' }"
  ></div>
</template>

<script>
import mxgraph from "@/mxgraph";
const {
  mxClient,
  mxUtils,
  mxEvent,
  mxRectangle,
  mxGraph,
  mxRubberband,
  mxGraphView,
} = mxgraph;
export default {
  data() {
    return {
      width: 400,
      height: 400,
    };
  },
  mounted() {
    this.render(document.getElementById("graphContainer"));
  },
  methods: {
    render(container) {
      // 确定浏览器是否支持
      if (!mxClient.isBrowserSupported()) {
        mxUtils.error("浏览器不支持!", 200, false);
      } else {
        // 禁用浏览器右键菜单
        mxEvent.disableContextMenu(container);

        mxGraph.prototype.getMaximumGraphBounds = () => {
          return new mxRectangle(0, 0, this.width, this.height);
        };

        var graph = new mxGraph(container);
        var parent = graph.getDefaultParent();

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
  width: 400px;
  height: 400px;
  border: 1px solid red;
  margin: 50px auto;
  position: relative;
  background: url("../assets/images/grid.gif");
  cursor: default;
  touch-action: none;
  // border: 1px solid red;
}
</style>
