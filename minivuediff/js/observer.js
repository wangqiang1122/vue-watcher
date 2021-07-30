// observe 每生成一个组件伴生一个Observer
class Observer {
  constructor(value) {
    // 给所有的对象都要添加一个__ob__
    this.value = value;
    this.dep = new Dep();
    def(value, '__ob__', this) // 给对对象绑定了一个observer
    // 需要判断当前数据是不是数组 数组比较特殊
    // console.log(this.value)
    if (Array.isArray(this.value)) {
      // console.log('数组双向绑定的操作')
      // console.log(value)
      protoAugment(value, arrayMethods)
    } else {
      // 对象进行具体响应式
      this.walk();
    }
  }
  walk() {
    // 为对象具体的属性进行响应式
    Object.keys(this.value).forEach((attr) => {
      defineReactive(this.value, attr, this.value[attr])
    })
  }
}

// defineReactive 响应式具体实施的方法
function defineReactive(obj, key, value) {
  // 深层次的遍历
  var a = observe(value);
  // console.log(a)
  // 每个对象都需要生成一个dep对象收集watcer
  let dep = new Dep(); // get 时需要收集一次依赖
  Object.defineProperty(obj, key, {
    set(newvalue) {
      if (value !== newvalue) {
        observe(newvalue);
        value = newvalue;
        console.log(dep)
        dep.notify()
      }
    },
    get() {
      // Dep.target其实就是一个watcher 也就是我们已经写好的更新函数
      console.log(Dep.target)
      Dep.target && dep.addDep(Dep.target) // 收集watcher依赖、
      // 需要收集v数组的watcher
      if (a) {
        // 在数组上有一个dep
        //
        Dep.target && a.dep.addDep(Dep.target)
      }
      return value
    },
  })
}

 // 对象响应式处理
 function observe(obj) {
  // 判断obj类型必须是对象
  if (typeof obj !== 'object' || obj == null) {
    return
  }
  return new Observer(obj)
}