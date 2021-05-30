  // 为一个对象绑定一个方法属性
  function def(obj,key,val,enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    })
 }
 
 // dep 收集watcher用的
 class Dep {
    constructor() {
     this.deps = []
    }
    addDep(watcher) {
      console.log(watcher)
      this.deps.push(watcher)
    }
    notify() {
     // 执行该对象属性收集的 watcher 模版中用到多少 就有多少
     this.deps.forEach(watcher => watcher.update())
   }
  }