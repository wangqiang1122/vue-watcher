let uid = 0
var pub = null;
// 具体的更新执行者
function Watcher(vm, updateComponent, cb) {
    // this.vm = vm;
    // this.key = key;
    // this.cb = cb;
    // this.uid = uid++
    // // 将来new 一个监听器时，将当前的Watcher实例附加到 Dep.target上
    // // 避免不必要的重复添加
    // // key.split('.').forEach(item=>{   

    // 如果是diff需要每个组件一个diff 保证只有一个watcher运行 保证最大效率 
    // 需要在内部解析模版并且添加相应
    // })
    this.vm = vm;
    this.uid = uid++
    astCompile.call(this,updateComponent)
    // this.updateComponent = updateComponent;
}
Watcher.prototype.update = function () {
    // console.log(this.vm)
    // console.log('视图更新啦')
    // console.log(this.vm[this.key])
    // this.cb.call(this.vm, this.vm[this.key]);
    //  alert('diff')
    //  clearTimeout(a)
    //  var a = setTimeout(()=>{
    //     alert('diff')
    //  },0)
    // alert()
    queueWatcher.call(this,this)
}
// setTimeout(()=>{

// },0)
var g = Promise.resolve();
let wait = false
function queueWatcher(watcher) {
   if (wait) {
       
   }    
   return
   console.log(this.vm) 
   console.log(watcher)
}




function astCompile(ast) {
    console.log(this)
    // let watcher = new 
    ast.children.forEach((itemNode) => {
        if (isElement(itemNode) && !Array.isArray(itemNode.children)) {
            // this.compileElement(itemNode)
        } else if (isInter(itemNode) && !Array.isArray(itemNode.children)) {
            // 如果发现有有变量 需要给当前组件 附一个当前watcher 的uid
            // console.log(itemNode)
            // console.log(RegExp.$1)
            console.log(this.vm)
            compileText.call(this,itemNode)
        }
        //   // 如果还有子元素继续循环
        //   // console.log(itemNode)
        if (Array.isArray(itemNode.children)) {
            astCompile.call(this,itemNode)
        }
    })
}
function compileText (node) {
    console.log(node)
    console.log(RegExp.$1)
   console.log(this)
//    alert(this.vm[RegExp.$1])
   Dep.target = this;
   this.vm[RegExp.$1];
   Dep.target = null;
    // console.log(text)
    // 更新模版里 {{name}}
    // this.update(node, RegExp.$1, 'text')
  }


function isInter(node) {
    // alert(JSON.stringify(node))
    // 是不是字符串类型 并且解析出来
    return node.type === 3 && /\{\{(.*)\}\}/.test(node.children)
}

function isElement(node) {
    return node.type == 1
}