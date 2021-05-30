// 把虚拟dom转换成render函数
// _c() 是render函数 createElement
// _v() 建立文本节点 createTextNode
// _s() 对{{}}里的数据处理
/** 
 * 生成rendercode
 * 
 * 
*/

const defaultTagRE = /\{\{(.+?)\}\}/g


function render() {
    return `
      _c(div,{ 
        id: 'div',
        style: {'color':'red'}
        },
        _v("你好，", _s(name)),
        _c('span',{
            id:'span1',style: {
              'font-size': '16px'  
            }
        }) 
      )
    `
}
function zidingyi(objval) {
    let arr = objval.split(';').slice(0, -1)
    let obj = {};
    arr.map(item => {
        let hiht = item.split(':');
        obj[hiht[0]] = hiht[1].trim()
    })
    return obj
}
function formatProps(attrs) {
    let obj = {};
    let str = '';
    attrs.forEach(item => {
        if (item.name == 'style') {
            obj[item.name] = zidingyi(item.value)
            str += `${item.name}:${JSON.stringify(zidingyi(item.value))},`
        } else {
            str += `${item.name}:${JSON.stringify(item.value)},`
        }
    })
    return `{${str.slice(0, -1)}}`
}
function gentateChild(node) {
    if (node.type == 1) {
        return generate(node)
    } else if (node.type == 3) {
        // 文字解析 需要分理出变量
        var text = node.children;
        if (!defaultTagRE.test(text)) {
            console.log(text)
            return `_v(${JSON.stringify(text)})`
        }
        let match, index, lastIndex = defaultTagRE.lastIndex = 0, textArr = [];
        while (match = defaultTagRE.exec(text)) {
            index = match.index;
            if (index > lastIndex) { // 第一次进来
                textArr.push(`${JSON.stringify(text.slice(lastIndex, index))}`);
            }
            textArr.push(`_s(${match[1]})`)
            lastIndex = index + match[0].length;
        }
        if (lastIndex < text.length) {
            textArr.push(`_v(${JSON.stringify(text.slice(lastIndex))})`)
        }
        return `_v(${textArr.join('+')})`
    }
}
function getChildren(ast) {
    let children = ast.children;
    if (children) {
        return (children.map(c => gentateChild(c))).join(',')
    }
}
function generate(ast) {
    // 处理children
    let children = getChildren(ast)
    console.log(ast)
    let code = `_c('${ast.tag}',${ast.attrs.length > 0
            ? `${formatProps(ast.attrs)},` : 'undefined,'}${children ? children : ''})
 ` ;
    return code
}