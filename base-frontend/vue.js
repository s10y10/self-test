function Vue(options) {
  this.options = options;
  this.el = options.el;
  this.data = options.data;

  if (this.el) {
    observer(this.data);
    proxyData(this.data, this);
    compile(this.el, this);
  }
}

function observer(data) {
  if (!data || typeof data !== 'object') return;
  Object.keys(data).forEach((key) => {
    defineObj(data, key, data[key]);
    observer(data[key]);
  });
}

function proxyData(data, vm) {
  Object.keys(data).forEach((key) => {
    Object.defineProperty(vm, key, {
      get() {
        return data[key];
      },
      set(val) {
        data[key] = val;
      },
    });
  });
}

function Compile() {}

function Dep() {
  this.subs = [];
  this.addSub = function (watcher) {
    this.subs.push(watcher);
  };
  this.notify = function () {
    this.subs.forEach((watcher) => watcher.update());
  };
}

function Watch(vm, exp, cb) {
  this.vm = vm;
  this.exp = exp;
  this.cb = cb;
  this.value = vm;
}

function defineObj(obj, key, value) {
  let dep = new Dep();
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      Dep.target && dep.addSub(Dep.target);
      return value;
    },
    set(val) {
      if (value != val) {
        observer(val);
        value = val;
        dep.notify();
      }
    },
  });
}
