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