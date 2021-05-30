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