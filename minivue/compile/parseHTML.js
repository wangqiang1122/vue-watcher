const decodingMap = {
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&amp;': '&',
    '&#10;': '\n',
    '&#9;': '\t',
    '&#39;': "'"
}
const ncname = '[a-zA-Z_][\\-\\.0-9_a-zA-Z]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const f = '[a-zA-Z]*'
const startTagOpen = new RegExp(`^<(${f})`)
let index = 0
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const attrziding = /^\s*([a-z]*)(=)(?:"|')((;|:|\w|\s|-)*)(?:"|')/;
// const str = ' id="div1">   </div>'
// console.log(str.match(attrziding))
// const endstr = '    </div>';
const endtagReg = /^\s*(?:<\/)([a-z]*)(?:>)/
// console.log(endstr.match(endtag))
function parseHTML(html) {
    // root是根节点
    let root = null, stack = [], crrentNode;

    let text;
    // dom节点转字符串
    const div = document.createElement('div');
    div.appendChild(html.cloneNode(true))
    let html1 = div.innerHTML;
    while (html1) {
        let textEnd = html1.indexOf('<'); // 说明是前面的
        if (textEnd == 0) { // 说明是标签
            const startTagMatch = parseStartTag() // 前标签
            console.log('++++' + JSON.stringify(startTagMatch))
            // 对标签里字符串内容进行收集
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue  // 下面不走了 继续循环
            }
            // 是否是尾部标签的
            const endTagMatch = html1.match(endtagReg)
            console.log(endTagMatch)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue
            }
        }
        // 说明是文本节点了
        if (textEnd > 0) {
            text = html1.substring(0, textEnd)
        }
        if (text) {
            chair(text)
            advance(text.length)
        }

    }
    // 剪裁字符串
    function advance(n) {
        index += n
        html1 = html1.substring(n)
    }
    // 对前标签进行处理
    function parseStartTag() {
        // 需要判断是不是子节点 判断跟节点有没有
        let match = null;
        const start = html1.match(startTagOpen) // 分解ast 得出当前标签
        console.log(start)
        // 对标签的处理
        if (start && !html1.match(endtagReg)) {
            // root.tag = start[1]
            match = {
                tagName: start[1],
                attrs: [],
            }
            // stack.push(start[1])
            advance(start[0].length)
        }
        // 对前闭合标签的处理
        let end, attrs;
        // console.log(/^\s*>/.test(html1))
        // console.log(html1.match(/^\s*>/))
        // 判断不是闭合标签 循环出属性值
        while (!(end = html1.match(/^\s*>/)) && (attrs = html1.match(attrziding))) {
            console.log(attrs);
            match.attrs.push(
                {
                    name: attrs[1],
                    value: attrs[3],
                }
            );
            advance(attrs[0].length)
        }
        // 对闭合标签的判断
        console.log(/\s*>/.test(html1))
        // 匹配到了结束标签
        if (end) {
            advance(end[0].length)
        }
        // console.log(html1)
        // console.log(match)

        return match
    }
    // 
    function start(tagName, attrs) {
        console.log('-----开始---')
        console.log(tagName, attrs)
        // 开始处理开始标签
        let element = createASTElement(tagName, attrs)
        // 根的链表生成
        if (!root) {
            root = element;
        }
        // 当前节点
        crrentNode = element;
        // 押入到栈中
        stack.push(element)
    }
    function end(tagName) {
        console.log('----结束----')
        // 结束最为复杂
        let element = stack.pop();
        // 找到父级
        crrentNode = stack[stack.length - 1];
        if (crrentNode) {
            element.parent = crrentNode;
            crrentNode.children.push(element)
        }
        console.log(tagName)
    }
    function chair(text) {
        console.log('----文本----')
        // console.log(text.trim())
        // let text = text.tirm();
        crrentNode.children.push({
            type: 3,
            children: text.trim()
        })
    }

    function createASTElement(tagName, attrs) {
        return {
            tag: tagName,
            type: 1,
            children: [],
            attrs,
            parent,
        }
    }
    return root
}

