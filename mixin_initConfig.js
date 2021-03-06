let eventMixin = {
    on(eventName, handler) {
        if (!this.events)
            this.events = {};
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(handler);
    },

    un(eventName, handler) {
        let handlers = this.events && this.events[eventName];
        if (!handlers)
            return;
        for (let i = 0; i < handlers.length; i++) {
            if (handlers[i] === handler) {
                handlers.splice(i--, 1);
            }
        }
    },
    fireEvent(eventName, ...args) {
        if (!this.events || !this.events[eventName]) {
            return;
        }

        this.events[eventName].forEach(handler=>handler.apply(this, args));
    }
};

class Base {
    mixin = [eventMixin];
    constructor(){
        console.log(arguments)
        Object.assign(Base.prototype, ...this.mixin)
    }    
    initConfig(config){
        let me = this;
        for (let i in me.config) {
            me[i] = typeof config[i] != "undefined" ? config[i] :  me.config[i];
        }
    }

}
class Store extends Base{
    mixin = [{getSomething: function(){return "something"}}]
    constructor(config) {
        super(config)
        Object.assign(Store.prototype, ...this.mixin)
        this.initConfig(config || {})
    }
    config = {
        data: [],
        paging: false,
        pageSize: 10,
    }
    add(record, index) {
        this.data.push(record);
        this.fireEvent("load", this)
    }
}



let store1 = new Store({paging:true});
let store2 = new Store({data:[{s: 89}]});
let store3 = new Store();
store3.on("load", function(store){
//event handler
})
store3.add({s: 89})
// event handler will be called

