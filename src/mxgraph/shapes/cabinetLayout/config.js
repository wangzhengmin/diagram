export const attrs = [
  {
    title: "重量",
    unit: "kg",
  },
  {
    title: "重量",
    unit: "kg",
  },
];

export const capacity = 12;
export const attrUnitWidth = 70;
export const theadHeight = 50;
export const tfootHeight = 50;
export const cellHeight = 30;
export const cellWidth = 50;
export const titleWidth = 150;
export const attrLen = attrs.length;
export const unitWidth = 30;
export const cabinetInterval = 50;
export const attrWidth = attrLen * attrUnitWidth + titleWidth + unitWidth;
export const cabinetWidth = attrWidth + unitWidth;
export const cabinetHeight = theadHeight + tfootHeight + capacity * cellHeight;
export const cols = attrLen + 3;
