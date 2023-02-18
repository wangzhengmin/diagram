import mxgraph from "../index";
export const isZoomWheelEvent = function (evt) {
  const { mxEvent, mxClient } = mxgraph;
  return (
    mxEvent.isAltDown(evt) ||
    (mxEvent.isMetaDown(evt) && mxClient.IS_MAC) ||
    mxEvent.isControlDown(evt)
  );
};
