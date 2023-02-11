## 1. drawio中如何导入自定义图标库

![image-20221203125847084](C:\Users\86136\AppData\Roaming\Typora\typora-user-images\image-20221203125847084.png)

![image-20221203125132275](C:\Users\86136\AppData\Roaming\Typora\typora-user-images\image-20221203125132275.png)

![image-20221203205420293](C:\Users\86136\AppData\Roaming\Typora\typora-user-images\image-20221203205420293.png)

![image-20221203205623334](C:\Users\86136\AppData\Roaming\Typora\typora-user-images\image-20221203205623334.png)

![image-20221203205638986](C:\Users\86136\AppData\Roaming\Typora\typora-user-images\image-20221203205638986.png)

![image-20221203211206581](C:\Users\86136\AppData\Roaming\Typora\typora-user-images\image-20221203211206581.png)

![image-20221203211506744](C:\Users\86136\AppData\Roaming\Typora\typora-user-images\image-20221203211506744.png)

## 2. 设置mxgraph 画布大小

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

## 5. 如何开启框选

```js
new mxRubberband(graph);
```

## 6. 是否可以创建新的连接

```js
 graph.setConnectable(true);
```

## 7.获取mxCell的style

```js
graph.getCellStyle(cell)
```

## 8.优化滚动条

```js
graph.timerAutoScroll = true;
graph.allowAutoPanning = true;
```

## APi

- `graph.setAllowDanglingEdges(false)` 连线是否两端是否一定要连上

- ` graph.setMultigraph(false)` 相同顶点是否可以有多条连线

- `graph.setTooltips(true)` 指定是否应该启用工具提示。`mxTooltipHandler`

- `mxGraph.prototype.multiplicities`  描述图中允许的连接的mxmultiplicity数组。 `mxMultiplicity`

  ```js
  graph.multiplicities.push(new mxMultiplicity(
      false, 'Source', null, null, 0, 0, null,
      'Source Must Have No Incoming Edge',
      null));
  ```

- `graph.isValidDropTarget` 是否是有效的放置目标，如果是会组合在一起
- `graph.moveCells` 移动指定的单元格
- `graph.getCellStyle` 获取指定目标的样式

## 事件

- [mxEvent.CELLS_ADDED](http://192.168.43.82:8081/docs/js-api/files/view/mxGraph-js.html#mxGraph.mxEvent.CELLS_ADDED) cell 添加到父级后触发的事件


```js
graph = {
	view: { // mxGraphView
	
	}
}
```



## grapheditor 分析

### 初始化

```js
// 初始化
new EditorUi(new Editor(urlParams['chrome'] == '0', themes));
```

### Editor

```js
// 加载graph
this.graph = graph || this.createGraph(themes, model);

// 监听图形变化
this.graph.getModel().addListener(mxEvent.CHANGE, mxUtils.bind(this, function()
{
    this.setModified(true);
}));

// 自动保存
Editor.prototype.setAutosave = function(value)
{
	this.autosave = value;
	this.fireEvent(new mxEventObject('autosaveChanged'));
};

// 重置graph
Editor.prototype.resetGraph = function()
{
	this.graph.gridEnabled = !this.isChromelessView() || urlParams['grid'] == '1';
	this.graph.graphHandler.guidesEnabled = true;
	this.graph.setTooltips(true);
	this.graph.setConnectable(true);
	this.graph.foldingEnabled = true;
	this.graph.scrollbars = this.graph.defaultScrollbars;
	this.graph.pageVisible = this.graph.defaultPageVisible;
	this.graph.pageBreaksVisible = this.graph.pageVisible; 
	this.graph.preferPageSize = this.graph.pageBreaksVisible;
	this.graph.background = null;
	this.graph.pageScale = mxGraph.prototype.pageScale;
	this.graph.pageFormat = mxGraph.prototype.pageFormat;
	this.graph.currentScale = 1;
	this.graph.currentTranslate.x = 0;
	this.graph.currentTranslate.y = 0;
	this.updateGraphComponents();
	this.graph.view.setScale(1);
};
```

### EditorUi

```js
this.initialDefaultVertexStyle = mxUtils.clone(graph.defaultVertexStyle);
this.initialDefaultEdgeStyle = mxUtils.clone(graph.defaultEdgeStyle);

// 更快的滚动轮缩放可能与CSS转换
if (graph.useCssTransforms)
{
    this.lazyZoomDelay = 0;
}

// 在无铬模式下禁用图形和强制平移
if (this.editor.chromeless && !this.editor.editable)
{
    this.footerHeight = 0;
    graph.isEnabled = function() { return false; };
    graph.panningHandler.isForcePanningEvent = function(me)
    {
        return !mxEvent.isPopupTrigger(me.getEvent());
    };
}

this.actions = new Actions(this);
// 顶部菜单栏
this.menus = this.createMenus();
```



<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 0 10 L 50 10 M 10 0 L 10 50 M 0 20 L 50 20 M 20 0 L 20 50 M 0 30 L 50 30 M 30 0 L 30 50 M 0 40 L 50 40 M 40 0 L 40 50" fill="none" stroke="#acacac" opacity="0.2" stroke-width="1"/>
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#acacac" stroke-width="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)"/>
            </svg>