import { createVertexTemplateEntry } from "./util";
import mxgraph from "@/mxgraph/index.js";
const { mxConstants } = mxgraph;
function createBasicShapes() {
  let w = 100;
  let h = 100;
  let s2 =
    mxConstants.STYLE_VERTICAL_LABEL_POSITION +
    "=bottom;" +
    mxConstants.STYLE_VERTICAL_ALIGN +
    "=top;html=1;shape=mxgraph.basic.";

  return [
    createVertexTemplateEntry(
      s2 + "rect;fillColor2=none;strokeWidth=1;size=20;indent=5;",
      w * 1.2,
      h * 0.6,

      ""
    ),
    createVertexTemplateEntry(
      "shape=partialRectangle;whiteSpace=wrap;html=1;top=0;bottom=0;fillColor=none;",
      w * 1.2,
      h * 0.6,

      "Partial Rectangle"
    ),
    createVertexTemplateEntry(
      "shape=step;perimeter=stepPerimeter;whiteSpace=wrap;html=1;fixedSize=1;",
      120,
      80,

      "Step"
    ),
  ];
}

export default createBasicShapes;
