class Minivue {
    constructor(obj) {
        this.$data = obj.data; // 保存数据
        this.$el = obj.el; // 保存el
        this.$methods = obj.methods && Object.getOwnPropertyNames(obj.methods).length > 0 ? obj.methods : {};
        // 做数据响应式
        observe(this.$data)
        // 数据响应式做完 需要做数据代理 方面查找数据
        proxy(this)
        // 模版编译
        new Compile(this.$el, this);
        console.log(this)
        // var vnode = renderMinix(this)
        // console.log(vnode)
        console.log(this.vdom)
        patch(this.$el,this.vdom)
    }
}

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
    console.log(text)
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