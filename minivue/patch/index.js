function patch(oldvnode,vnode) {
    let el = createElement(vnode);
    console.log(document.querySelector(oldvnode))
    parentElement = document.querySelector(oldvnode).parentNode;
    console.log(parentElement)
    console.log(el)
    parentElement.insertBefore(el,document.querySelector(oldvnode).nextSibling)
 }
 function createElement(vnode) {
     console.log(vnode)
     let { tag,props,children, text,onechildren } = vnode 
     if (typeof tag ==='string') {
       vnode.el = document.createElement(tag);
       updateProps(vnode)
       console.log(children)
       children.map(item=>{
         vnode.el.appendChild(createElement(item) )
       })
     } else {
         if (onechildren) {
            vnode.el = document.createTextNode(onechildren)
         } else {
             console.log(children)
            vnode.el = document.createTextNode(children)
         }
     }
     return vnode.el;
 }
 function updateProps(vnode) {
    let el = vnode.el;
    console.log(el)
    console.log(vnode)
    let newProps = vnode.attrs||[];
    newProps.forEach(item=>{
        el.setAttribute(item.name,item.value)
    })
    // for(let attr in newProps) {

    //     // if(attr=='style') {
    //     //     for (let [key ,value] of Object.entries(newProps[attr])){
    //     //         el.style[key] = value;
    //     //     }
    //     // } else if(attr=='class') {
    //     //     el.className = newProps[attr]
    //     // } else {
    //         el.setAttribute(attr,newProps[attr])
    //     // }
    // }
 }