// vue对数组处理的模拟
const arrayProto = Array.prototype // 拿到数组的原型
// 复制一份数组的原型
const arrayMethods = Object.create(arrayProto)
// 需要改变的7个数组方法
// 七个改变数组的方法
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

// const { parseHTML } =require('./ast')

// 数组方法处理
methodsToPatch.forEach(method=>{
  const original = arrayProto[method]; // 拿到了原生的方法
  def(arrayMethods,method,function mutator(...args) {
    let reslut = original.apply(this,args) // 执行原来的方法
    inserted = args; // 拿到了传过来的参数
    // 执行更新ui操作
    console.log(this['__ob__'])
    this['__ob__'].dep.notify();
    return reslut
  })
})

// 类vue组件
class Wue {
  constructor(obj) {
    this.$data = obj.data; // 保存数据
    this.$el = obj.el; // 保存el
    this.$methods = Object.getOwnPropertyNames(obj.methods).length>0?obj.methods:{} ;
    // console.log(this.$methods)
    // 做数据响应式
    observe(this.$data)
    // 数据响应式做完 需要做数据代理 方面查找数据
    proxy(this)
    // 模版编译
    new Compile(this.$el,this);
    // // console.log(this._render())
    // // 扩展方法并且拿到虚拟dom
    var vnode = renderMinix(this)
    
    // //
    patch(this.$el,vnode)
  }
}
Wue.prototype._c = function() {
  return createElememt(...arguments)
}
Wue.prototype._s = function(value) {
 if (value==null) return;
 return typeof value === 'object'? JSON.stringify(value): value
}
Wue.prototype._v = function(text) {
  console.log(text)
 return createTextVnode(text)
}
function createElememt(tag,props={},...children) {
  return vnode(tag,props,children)
}
function createTextVnode(text) {
  return vnode(undefined,undefined,undefined,text)
}
function vnode(tag,props,children,text) {
  return {
      tag,
      props,
      children,
      text,
  }
}
// 将$data中的key代理到KVue实例上
function proxy(vm) {
  Object.keys(vm.$data).forEach(key=>{
    Object.defineProperty(vm,key,{
      get: function() {
        return vm.$data[key]
      },
      set: function(newvalue) {
        vm.$data[key] = newvalue
      }
    })
  })
}
function protoAugment(val,arrayMethods) {
   // 数组方法需要重新写
   // arrayMethods进过处理过的数组方法
   val['__proto__'] = arrayMethods
}
// observe 每生成一个组件伴生一个Observer
class Observer {
  constructor(value) {
    // 给所有的对象都要添加一个__ob__
    this.value = value;
    this.dep = new Dep();
    def(value,'__ob__',this) // 给对对象绑定了一个observer
    // 需要判断当前数据是不是数组 数组比较特殊
    console.log(this.value)
    if(Array.isArray(this.value)) {
        console.log('数组双向绑定的操作')
        console.log(value)
        protoAugment(value,arrayMethods)
    } else {
        // 对象进行具体响应式
        this.walk();
    }
  }
  walk() {
    // 为对象具体的属性进行响应式
    Object.keys(this.value).forEach((attr)=>{
        defineReactive(this.value,attr,this.value[attr])
    })
  }
}
// 数组方法

// Compile 编译 // 简略版比vue的简单多了
class Compile {
  constructor(el,vm) {
    // 当前实例
    this.$vm = vm;
    // 编译模版
    this.$el = document.querySelector(el)
    // 编译模版
    // this.compile(this.$el)
    // ast 模版编译
    var ast = parseHTML(this.$el)
    // // 生成render函数
    var code = generate(ast)
    console.log(code)
    var render = new Function(`with(this){ return ${code} }`)
    console.log(render)
    this.$vm._render = render;
  }
  compile(el) {
//    console.log(el.childNodes)
    el.childNodes.forEach(itemNode=>{
        if(this.isElement(itemNode)) {
          this.compileElement(itemNode)
        } else if(this.isInter(itemNode)) {
          this.compileText(itemNode)
        }
        // 如果还有子元素继续循环
        if (itemNode.childNodes){
            this.compile(itemNode)
        }
    })
  }
  isElement(node) {
    return node.nodeType==1
  }
  // 定义标签模版
  compileElement(node) {
    // 获取标签上所有的属性
    let attrs = node.attributes; //获取标上所有属性
    Array.from(attrs).forEach((attr)=>{
        let attrName = attr.name // k-xxx
        let exp = attr.value // aaa
        if (attrName.startsWith('@'||attrName.startsWith('v-on'))) {
            // 绑定事件
            attrName = attrName.substr(1);
            if (attrName.startsWith('v-on')) {
                attrName = attrName.substr(4);
              }
            this.eventBinding(node,attrName,exp)
        }
    })
  }
  // 定义字符串
  compileText(node) {
    // console.log(text)
    // 更新模版里 {{name}}
    this.update(node, RegExp.$1, 'text')

  }
  // 事件绑定
  eventBinding(tag,eventName,exp) {
    //  window.addEventListener('事件名','回调函数',useCaptrue) // false是冒泡内部元素先被触发
    // true 捕获阶段 是外部元素先被触发
    tag.addEventListener(eventName,this.$vm.$methods[exp].bind(this.$vm),false)
  }
  update(node,exp,dir) {
    // 初始化
    const fn = this[dir + 'Updater'];
    const reg1 = /{{.*}}/gi
    fn && fn(node, this.$vm[exp])
        // 更新:
    new Watcher(this.$vm, exp, (val)=> {
          // console.log(val)
          // console.log(node)
          fn && fn(node, val)
    })
  }
  textUpdater(node,value) {
      // 更新文字
      node.textContent = value
  }
    // 判断是否是插值表达式{{xx}}
  isInter(node) {
      // 是不是字符串类型 并且解析出来
     return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }

}

 // Watcher 小秘书 以一个组件一个watcher
 class Watcher { // 更新组件用每个对象甚至每个data里的属性都相对应一个watcher
    // 值改变 对应的ui改变
    constructor(vm, key, updateFn) {
      this.vm = vm;
      this.key = key;
      this.updateFn = updateFn;
      Dep.target = this;
      alert(this.vm[key])
      this.vm[key]; // 在new watcher时去执行获取操作 把当前watcher押入到dep里
      Dep.target = null;
    }
    // watcher 更新操作
    update() {
     console.log(this.updateFn) 
     this.updateFn&&this.updateFn.call(this.vm,this.vm[this.key])
    }
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


 // 对象响应式处理
function observe(obj) {
    // 判断obj类型必须是对象
    if (typeof obj !== 'object' || obj == null) {
      return
    }
    return new Observer(obj)
  }
 // 为一个对象绑定一个方法属性
 function def(obj,key,val,enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    })
 }
 // defineReactive 响应式具体实施的方法
 function defineReactive(obj,key,value) {
     // 深层次的遍历
     var a = observe(value);
     console.log(a)
     // 每个对象都需要生成一个dep对象收集watcer
     let dep = new Dep(); // get 时需要收集一次依赖
     Object.defineProperty(obj,key,{
         set(newvalue) {
          if (value!==newvalue) {
            observe(newvalue);
            value = newvalue;
            console.log(dep)
            dep.notify()
          }
         },
         get() {
             // Dep.target其实就是一个watcher 也就是我们已经写好的更新函数
             Dep.target && dep.addDep(Dep.target) // 收集watcher依赖、
             // 需要收集v数组的watcher
             if (a) {
                // 在数组上有一个dep
                //
                Dep.target&&a.dep.addDep(Dep.target)
             }
             return value
         },
     })
 }
