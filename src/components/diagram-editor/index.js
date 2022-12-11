import mxgraph from "@/mxgraph";

const { mxRectangle, mxConstants, mxResources } = mxgraph;

function getFormats() {
  return [
    {
      key: "letter",
      title: 'US-Letter (8,5" x 11")',
      format: mxConstants.PAGE_FORMAT_LETTER_PORTRAIT,
    },
    {
      key: "legal",
      title: 'US-Legal (8,5" x 14")',
      format: new mxRectangle(0, 0, 850, 1400),
    },
    {
      key: "tabloid",
      title: 'US-Tabloid (11" x 17")',
      format: new mxRectangle(0, 0, 1100, 1700),
    },
    {
      key: "executive",
      title: 'US-Executive (7" x 10")',
      format: new mxRectangle(0, 0, 700, 1000),
    },
    {
      key: "a0",
      title: "A0 (841 mm x 1189 mm)",
      format: new mxRectangle(0, 0, 3300, 4681),
    },
    {
      key: "a1",
      title: "A1 (594 mm x 841 mm)",
      format: new mxRectangle(0, 0, 2339, 3300),
    },
    {
      key: "a2",
      title: "A2 (420 mm x 594 mm)",
      format: new mxRectangle(0, 0, 1654, 2336),
    },
    {
      key: "a3",
      title: "A3 (297 mm x 420 mm)",
      format: new mxRectangle(0, 0, 1169, 1654),
    },
    {
      key: "a4",
      title: "A4 (210 mm x 297 mm)",
      format: mxConstants.PAGE_FORMAT_A4_PORTRAIT,
    },
    {
      key: "a5",
      title: "A5 (148 mm x 210 mm)",
      format: new mxRectangle(0, 0, 583, 827),
    },
    {
      key: "a6",
      title: "A6 (105 mm x 148 mm)",
      format: new mxRectangle(0, 0, 413, 583),
    },
    {
      key: "a7",
      title: "A7 (74 mm x 105 mm)",
      format: new mxRectangle(0, 0, 291, 413),
    },
    {
      key: "b4",
      title: "B4 (250 mm x 353 mm)",
      format: new mxRectangle(0, 0, 980, 1390),
    },
    {
      key: "b5",
      title: "B5 (176 mm x 250 mm)",
      format: new mxRectangle(0, 0, 690, 980),
    },
    {
      key: "16-9",
      title: "16:9 (1600 x 900)",
      format: new mxRectangle(0, 0, 900, 1600),
    },
    {
      key: "16-10",
      title: "16:10 (1920 x 1200)",
      format: new mxRectangle(0, 0, 1200, 1920),
    },
    {
      key: "4-3",
      title: "4:3 (1600 x 1200)",
      format: new mxRectangle(0, 0, 1200, 1600),
    },
    { key: "custom", title: "自定义", format: null },
  ];
}
