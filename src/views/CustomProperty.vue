<template>
  <div>
    <h2>自定义属性</h2>
    <div>
      <p>属性名：<input type="text" v-model="attrName" /></p>
      <p>属性值：<input type="text" v-model="attrValue" /></p>
      <button @click="setAttr">设置</button>
    </div>
    <div>
      <h3>属性面版</h3>
      <ul>
        <li v-for="(attr, index) in attrs" :key="index">
          {{ attr.name }}---{{ attr.value }}
        </li>
      </ul>
    </div>
    <div id="graphContainer"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import mxgraph, { generateGraph, getGraph } from "@/mxgraph";

const {
  mxGraph,
  mxGraphLayout,
  mxClient,
  mxUtils,
  mxRectangle,
  mxLayoutManager,
  mxRubberband,
  mxKeyHandler,
  mxStackLayout,
  mxEvent,
} = mxgraph;

const attrName = ref("");
const attrValue = ref("");
const attrs = ref([]);

const setAttr = () => {
  if (attrName.value) {
    const graph = getGraph();
    const model = graph.getModel();
    const cell = graph.getSelectionCell();
    let value = graph.getModel().getValue(cell);

    if (!mxUtils.isNode(value)) {
      var doc = mxUtils.createXmlDocument();
      var obj = doc.createElement("object");
      obj.setAttribute("label", value || "");
      value = obj;
    }
    value.setAttribute(attrName.value, attrValue);
    attrs.value.push({ name: attrName.value, value: attrValue.value });
    model.setValue(cell, value);
  }
};

const addListener = () => {
  const graph = getGraph();
  graph.getSelectionModel().addListener(mxEvent.CHANGE, () => {
    const cells = graph.getSelectionCells();

    if (cells.length === 1) {
      attrs.value = [];
      let value = graph.getModel().getValue(cells[0]);
      if (!mxUtils.isNode(value)) {
        return (attrs.value = []);
      }
      const attrList = value.attributes;
      for (var i = 0; i < attrList.length; i++) {
        attrs.value.push({
          name: attrList[i].nodeName,
          value: attrList[i].nodeValue,
        });
      }
    } else {
      attrs.value = [];
    }
  });
};

const render = (container) => {
  if (!mxClient.isBrowserSupported()) {
    mxUtils.error("Browser is not supported!", 200, false);
  } else {
    const graph = generateGraph(container);

    graph.getLabel = function (cell) {
      if (typeof cell.value === "object") {
        return cell.value.getAttribute("label");
      } else {
        return cell.value;
      }
    };

    const model = graph.getModel();
    const parent = graph.getDefaultParent();

    model.beginUpdate();
    try {
      const cell = graph.insertVertex(parent, null, "设备1", 200, 20, 200, 50);
      graph.insertVertex(parent, null, "设备2", 200, 80, 200, 50);
      graph.insertVertex(parent, null, "设备3", 200, 150, 200, 50);
      let value = graph.getModel().getValue(cell);

      if (!mxUtils.isNode(value)) {
        var doc = mxUtils.createXmlDocument();
        var obj = doc.createElement("object");
        obj.setAttribute("label", value || "");
        value = obj;
      }
      value.setAttribute("property", "自定义属性");
      const attr = value.getAttribute("name");
      model.setValue(cell, value);
    } finally {
      model.endUpdate();
    }
  }
};

onMounted(() => {
  render(document.getElementById("graphContainer"));
  addListener();
});
</script>

<style lang="scss" scoped></style>
