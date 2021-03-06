function Wue(options) {
    this.$el = options.el;
    this.$data = options.data;
    this.$options = options;
    this.observe(this.$data); // 执行响应式数据操作
    new Compile(this.$el, this) // 执行模版编译工作
}

Wue.prototype.observe = function (data) {
    if (!data|| typeof data !=='object') {
        return
    }
    Object.keys(data).forEach(key => {
        // 为每个key定义get set
        this.defineReactive(data,key,data[key])
        // 做一个数据代理
        this.proxyDate(key)
    });
};
Wue.prototype.proxyDate = function(key) {
    // 向vue的实例上定义属性
    Object.defineProperty(this,key,{
        get(){
           return this.$data[key]
        },
        set(val) {
            alert(val)
            this.$data[key] = val
        }
    })
}
Wue.prototype.defineReactive = function (obj,key,val) {
    this.observe(val);
    var dep = new Dep();
    var that = this;
    // if (typeof val==='object') {
    //   console.log(this.observe(val));
    //
    // }
    Object.defineProperty(obj,key,{
        enumerable: true, //可配置 可枚举
        configurable: true, // 可删除的
        set(newval){
            if (newval===val) {
                return
            }
            console.log(val)
            console.log(key)
            val = newval;
            dep.notify()
        },
        // 初始化首先触发的是get
        get() {
          console.log(Dep.target);
          Dep.target&&dep.addep(Dep.target);
          return val
        }
    })
    // console.log(obj);
    // console.log(key);
    // console.log(val);
};

// 依赖管理器
/*
*  负责视图中所有的依赖和管理，包括添加依赖和通知
*  大管家 管理若干watcher
* */
function Dep() {
   this.deps = [];  //deps里面存放的全是Watcher的实例
    // 添加Watcher
   this.addep = function (dep) {
     this.deps.push(dep)
   }
   // 通知所有Watcher执行更新
    this.notify = function () {
      this.deps.forEach(item => {
          console.log(item)
          item.update();
      })
    }
}
// 具体的更新执行者
function Watcher(vm,key,cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;
    // 将来new 一个监听器时，将当前的Watcher实例附加到 Dep.target上
    // 避免不必要的重复添加
    // key.split('.').forEach(item=>{
        Dep.target = this;
        this.vm[key];
        Dep.target = null;
    // })
}
Watcher.prototype.update = function () {
    // console.log('视图更新啦')
    console.log(this.vm[this.key])
    this.cb.call(this.vm,this.vm[this.key]);
}
