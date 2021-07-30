let root="";
let vm = '';
let components = [];
class Minivue {
    constructor(obj) {

        // 组件化  
        // 
        vm = this
        this.$data = obj.data; // 保存数据
        this.$methods = obj.methods && Object.getOwnPropertyNames(obj.methods).length > 0 ? obj.methods : {};
        observe(this.$data)
        proxy(this)
        if (obj.el) {
            this.$el = obj.el; // 保存el
            new Compile(this.$el, this);
            // var vnode = renderMinix(this)
            // console.log(vnode)
            // patch(this.$el,vnode)
        } else {
           if (this.$children) {
             this.$children = [];
           }
           this.$children.push(new VueComponent(obj))
        }
        // new Compile(this.$el, this);
        // // if (obj.name) {
  
        // // }
        // if (!root) {
        //     this.root = this._render
        // } 
        // console.log(this)
        // // 做数据响应式
        // observe(this.$data)
        // // // 数据响应式做完 需要做数据代理 方面查找数据
        // proxy(this)
        // // // 模版编译
        // new Compile(this.$el, this);
        // console.log(this)
        // var vnode = renderMinix(this)
        // // // console.log(vnode)
        // // console.log(this.vdom)
        // patch(this.$el,vnode)
    }
}
function registerComponentHook() {}


// 将$data中的key代理到KVue实例上
function proxy(vm) {
    Object.keys(vm.$data).forEach(key => {
        Object.defineProperty(vm, key, {
            get: function () {
                return vm.$data[key]
            },
            set: function (newvalue) {
                vm.$data[key] = newvalue
            }
        })
    })
}
Minivue.prototype._c = function () {
    return createElememt(...arguments)
}
Minivue.prototype._s = function (value) {
    if (value == null) return;
    return typeof value === 'object' ? JSON.stringify(value) : value
}
Minivue.prototype._v = function (text) {
    return createTextVnode(text)
}
function createElememt(tag, props = {}, ...children) {
    return vnode(tag, props, children)
}
function createTextVnode(text) {
    return vnode(undefined, undefined, undefined, text)
}
function vnode(tag, props, children, text) {
    return {
        tag,
        props,
        children,
        text,
    }
}


function renderMinix(Vue) {
    //    console.log(Vue)
    //    Vue.prototype._c = function() {
    //        return createElememt(...arguments)
    //    }
    //    Vue.prototype._v = function(value) {
    //       if (value==null) return;
    //       return typeof value === 'object'? JSON.stringify(value): value
    //    }
    //    Vue.prototype._s = function(text) {
    //       return createTextVnode(text)
    //    }
    //    console.log(Vue)
       console.log(Vue._render())    
       return Vue._render()
}

function VueComponent(name,component) {
   console.log(name)
   console.log(component)
   return {
       tag: name,
       render: parseHTML(component.template),
   }
}

// 
var g = function() {
    return new Promise((reslove)=>{
        reslove()
    })
}
Minivue.components = function(name,component) {
  g().then(()=>{
    if (!vm.$children) {
        vm.$children = [];
    }
    vm.$children.push(new VueComponent(name,component))
  })
//   if (vm.$children) {
//     vm.$children = [];
//   }
//   vm.$children.push(new VueComponent(name,component))
//    console.log(name)
// let h = new Minivue(component)
// let data = { ...component.data(),...component.methods  }
// console.log(data) 
// let ast = parseHTML(component.template)
// var code = generate(ast)
// var render = new Function(`with(this){ return ${code} }`)
// // console.log(render.call(data))
// console.log(render)
}   