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
      if (this.deps.length==0) {
        this.deps.push(watcher)
      } else {
        this.deps.forEach(item=>{
          if (item.uid!=watcher.uid) {
            this.deps.push(watcher)
          }
        })
      }
    }
    notify() {
      // console.log(this.deps)
      // alert()
     // 执行该对象属性收集的 watcher 模版中用到多少 就有多少
     this.deps.forEach(watcher => watcher.update())
   }
  }