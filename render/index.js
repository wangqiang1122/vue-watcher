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