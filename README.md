## 1. drawio中如何导入自定义图标库

![image-20221203125847084](C:\Users\86136\AppData\Roaming\Typora\typora-user-images\image-20221203125847084.png)

![image-20221203125132275](C:\Users\86136\AppData\Roaming\Typora\typora-user-images\image-20221203125132275.png)

![image-20221203205420293](C:\Users\86136\AppData\Roaming\Typora\typora-user-images\image-20221203205420293.png)

![image-20221203205623334](C:\Users\86136\AppData\Roaming\Typora\typora-user-images\image-20221203205623334.png)

![image-20221203205638986](C:\Users\86136\AppData\Roaming\Typora\typora-user-images\image-20221203205638986.png)

![image-20221203211206581](C:\Users\86136\AppData\Roaming\Typora\typora-user-images\image-20221203211206581.png)

![image-20221203211506744](C:\Users\86136\AppData\Roaming\Typora\typora-user-images\image-20221203211506744.png)

## 2. mxgraph 画布大小

- `mxGraph.prototype.getMaximumGraphBounds` 返回所有图形应放置的区域

  ```js
   mxGraph.prototype.getMaximumGraphBounds = () => {
   	return new mxRectangle(0, 0, this.width, this.height);
   };
  ```

  参考：
  
  https://yejinzhan.gitee.io/2019/04/27/mxGraph%20%E5%85%A5%E9%97%A8%E5%AE%9E%E4%BE%8B%E6%95%99%E7%A8%8B/

## 3. 设置自定义属性

**设置自定义需要将XML节点作为单元格的值。**

```js
const graph = generateGraph(container);
const model = graph.getModel();
const parent = graph.getDefaultParent();

model.beginUpdate();
try {
    const cell = graph.insertVertex(parent, null, "设备1", 200, 20, 200, 50);
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
```

## 4. 使用XML节点作为单元值，值会显示不正确

```js
graph.getLabel = function (cell) {
    if (typeof cell.value === "object") {
        return cell.value.getAttribute("label");
    } else {
        return cell.value;
    }
};
```

