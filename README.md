# vue-watcher
vue-watcher

### 该代码实现了vue核心双向绑定功能 两个核心方法 object.defineProperty,watcher 方法，只要set了就是触发watcher方法

 在新建一个watcher对象时 会在watcher内部,给dep函数添加一个静态属性
 target，
 
 
 处理了一个bug，如果data数据是一个对象就无法渲染的问题，此问题的解决思路是在
 处理数据是，吧字符串类型的和对象类型的分开处理
 ```
    // 分开处理数据
    var g = exp.split('.');
       let current = vm;
       while (g.length){
           let h = g.shift();
           if (g.length===0) {
               console.log(current);
               this.update(node,current,h,'text') // 指明类型
           } else {
               current = current[h];
               console.log(current)
               this.update(node,current,h,'text') // 指明类型
           }
       }
 ```
