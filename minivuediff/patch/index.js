function patch(oldvnode,vnode) {
  let el = createElement(vnode);
  console.log(document.querySelector(oldvnode))
  parentElement = document.querySelector(oldvnode).parentNode;
  console.log(parentElement)
  console.log(el)
  parentElement.insertBefore(el,document.querySelector(oldvnode).nextSibling)
}
function createElement(vnode) {
   let { tag,props,children, text } = vnode 
   if (typeof tag ==='string') {
     vnode.el = document.createElement(tag);
     updateProps(vnode)
     console.log(children)
     children.map(item=>{
       vnode.el.appendChild(createElement(item) )
     })
   } else {
       vnode.el = document.createTextNode(text)
   }
   return vnode.el;
}
function updateProps(vnode) {
  let el = vnode.el;
  let newProps = vnode.props||{};
  for(let attr in newProps) {
      if(attr=='style') {
          for (let [key ,value] of Object.entries(newProps[attr])){
              el.style[key] = value;
          }
      } else if(attr=='class') {
          el.className = newProps[attr]
      } else {
          el.setAttribute(attr,newProps[attr])
      }
  }
}