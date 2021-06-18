// Compile 编译 // 简略版比vue的简单多了
// let uid = 0;
class Compile {g  
    constructor(el,vm) {
      // 当前实例
      this.$vm = vm;
      // 编译模版
      this.$el = document.querySelector(el)
      // 编译模版
      // this.compile(this.$el)
      // ast 模版编译
      var ast = parseHTML(this.$el)
      console.log(ast)
      // 需要进行watcher
      this.astCompile(ast)
      
   
    // 用with作用域的方式
      // var render = new Function(`with(this){ return ${code} }`)
      // console.log(render)
    // 用数据劫持的方式
    // console.log(this.astCompile(ast)) 

    // console.log(ast) 
    // //   console.log(render)
      // this.$vm._render = render;
    // this.$vm.vdom = ast;
    }
    astCompile(ast) {
      ast.children.forEach((itemNode)=>{
         console.log(this.isInter(itemNode))
        if(this.isElement(itemNode)&&!Array.isArray(itemNode.children)) {
            // this.compileElement(itemNode)
          } else if(this.isInter(itemNode)&&!Array.isArray(itemNode.children)) {
            // 如果发现有有变量 需要给当前组件 附一个当前watcher 的uid
            
            // this.compileText(itemNode)
          }
        //   // 如果还有子元素继续循环
        //   // console.log(itemNode)
          if (Array.isArray(itemNode.children)){
              this.astCompile(itemNode)
          } 
      })
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
      return node.type==1
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
      console.log(node)
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
      console.log('进行diff')
      // 更新:
      // new Watcher(this.$vm, exp, (val)=> {
      //       // console.log(val)
      //       // console.log(node)
      //       fn && fn(node, val)
      // })
    }
    textUpdater(node,value) {
        // console.log(node)
        // console.log(/\{\{(.*)\}\}/.exec(node.children))
        // console.log(value) 
        if (node.el) {
            node.el.textContent = value
            return 
        }
        // 更新文字 
        node.onechildren = node.children.replace(/\{\{(.*)\}\}/,value)
    }
      // 判断是否是插值表达式{{xx}}
    isInter(node) {
        // alert(JSON.stringify(node))
        console.log(node)
        // 是不是字符串类型 并且解析出来
       return node.type === 3 && /\{\{(.*)\}\}/.test(node.children)
    }
  
  }
  