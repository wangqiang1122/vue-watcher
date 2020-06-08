# vue-watcher
vue-watcher

### 该代码实现了vue核心双向绑定功能 两个核心方法 object.defineProperty,watcher 方法，只要set了就是触发watcher方法

 在新建一个watcher对象时 会在watcher内部,给dep函数添加一个静态属性
 target，
