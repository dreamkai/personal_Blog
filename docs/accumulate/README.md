# JavaScript

## ES6

### 1. symbol

#### 1.ES6 中新加入的 **原始数据类型(基本数据类型/值类型)**，代表唯一值

- 对象的唯一属性：防止同名属性，及被改写或覆盖
- 消除魔术字符串：指代码中多次出现，强耦合的字符串或数值，应避免，而使用含义清晰的变量代替

```js
let m = Symbol(),
  n = Symbol()
console.log(m === n) //false

let m = Symbol('A'),
  n = Symbol('A')
console.log(m === n) //false
```

::: tip 提示
魔术字符串是可以通过变量形式规避
:::

```js
function getMonth(month) {
  if (month == 'Triangle') {
    return true
  } else {
    return false
  }
}

getMonth('Triangle')
```

比如上文的`Triangle`就是魔术字符串,它多次出现与代码形成“强耦合”，当我们改带改代码的时候需要把所有出现该字段的地方修改一下,不利于将来的修改和维护

```js
const shapeType = {
  triangle: 'Triangle',
}

function getMonth(month) {
  if (month == shapeType.triangle) {
    return true
  } else {
    return false
  }
}

getMonth(shapeType.triangle)
```

这样如果要修改这个字符串只用更改一个地方即可，方便快捷也不会导致程序出错。

如果仔细分析，可以发现 shapeType.triangle 等于哪个值并不重要，只要确保不会跟其他 shapeType 属性的值冲突即可。因此，这里就很适合改用 Symbol 值。

```js
const shapeType = {
  triangle: Symbol(),
}
```

上面代码中，除了将`shapeType.triangle`的值设为一个 Symbol，其他地方都不用修改。

#### 2.在创建 Symbol 唯一值之后,取值必须注意

```js
let n = Symbol('N')
let obj = {
  name: '张三',
  age: 18,
  [n]: 100,
}
//此时
obj[Symbol('N')] //undefined
```

::: warning 注意
此时,Symbol 是新的唯一值,取不到
:::

```js
//此时
obj[Symbol('N')] = 200

// let obj = {
//     name:'张三',
//     age:18,
//     [Symbol('N')]:100,
//     [Symbol('N')]:200
// }

obj[n] //100
```

#### 3.Symbol 的原型有 constructor,是构造函数,但是内部不允许 new

`Symbol() instance of Symbol //false`

#### 4.Symbol 不能参加数学计算,不能参与隐式转换,但是可以显式转换

```js
let n = Symbol()
let p = n + 10

console.log(p) //报错

Number(Symbol()) // 报错

Symbol.toString() // "Symbol()"
```

::: tip 提示
Symbol 可以显式转换成字符串,但是不能转换成数字
:::

#### 5.Symbol 属性不参与 for…in/of 遍历,也不能被 Object.Keys()遍历

- Object.getOwnPropertySymbols()可以单独拿到 Symbol 的值

```js
Object.getOwnPropertySymbols().forEach((key) => {
  console.log(obj[key])
})
```

#### 6.内置的 Symbol 值

ES6 提供很多内置的 Symbol 值，指向语言内部使用的方法

- Symbol.hasInstance：对象的 Symbol.hasInstance 属性，指向一个内部方法，当其他对象使用 instanceof 运算符，判断是否为该对象的实例时，会调用这个方法

```js
class Person {}
let p1 = new Person()
console.log(p1 instanceof Person) //true
console.log(Person[Symbol.hasInstance](p1)) //true
console.log(Object[Symbol.hasInstance]({})) //true
```

- Symbol.isConcatSpreadable：值为布尔值，表示该对象用于 Array.prototype.concat()时，是否可以展开

```js
let arr = [4, 5, 6]
console.log(arr[Symbol.isConcatSpreadable]) //undefined
let res = [1, 2, 3].concat(arr)
console.log(res) //[1,2,3,4,5,6]

arr[Symbol.isConcatSpreadable] = false
res = [1, 2, 3].concat(arr)
console.log(res) //[1,2,3,[4,5,6]]
```

- Symbol.iterator：拥有此属性的对象被誉为可被迭代的对象，可以使用 for…of 循环

```js
// 让对象变为可迭代的值
let obj = {
  0: '珠峰培训',
  1: 11,
  length: 2,
  [Symbol.iterator]: Array.prototype[Symbol.iterator],
}
for (let item of obj) {
  console.log(item)
}

// 构造一个类数组
class ArrayLike {
  *[Symbol.iterator]() {
    let i = 0
    while (this[i] !== undefined) {
      yield this[i]
      ++i
    }
  }
}
let like1 = new ArrayLike()
like1[0] = 10
like1[1] = 20
for (let item of like1) {
  console.log(item)
}
```

- Symbol.toPrimitive: 该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值

```js
/*
 * 对象数据类型进行转换：
 * 1. 调用obj[Symbol.toPrimitive](hint)，前提是存在
 * 2. 否则，如果 hint 是 "string" —— 尝试 obj.toString() 和 obj.valueOf()
 * 3. 否则，如果 hint 是 "number" 或 "default" —— 尝试 obj.valueOf() 和 obj.toString()
 */
let a = {
  value: 0,
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case 'number': //此时需要转换成数值 例如:数学运算`
        return ++this.value
      case 'string': // 此时需要转换成字符串 例如:字符串拼接
        return String(this.value)
      case 'default': //此时可以转换成数值或字符串 例如：==比较
        return ++this.value
    }
  },
}
if (a == 1 && a == 2 && a == 3) {
  console.log('OK')
}
```

- Symbol.toStringTag：在该对象上面调用 Object.prototype.toString 方法时，如果这个属性存在，它的返回值会出现在 toString 方法返回的字符串之中，表示对象的类型

```js
class Person {
  get [Symbol.toStringTag]() {
    return 'Person'
  }
}
let p1 = new Person()
console.log(Object.prototype.toString.call(p1)) //"[object Person]"
```

### 2. Promise

#### 2.1 Promise

- Promise 是一个类,用来解决异步问题
- Promise 有三个状态 等待态(默认状态),成功状态,失败状态,一旦成功了就不能失败,反之也一样

```js
const PENDING = 'PENDING'
const RESOLVED = 'RESOLVED'
const REJECTED = 'REJECTED'

//宏变量
//因为所有的promise都遵循这个规范,这里这个写法应该兼容所有的promise

const resolvePromise = (promise2, x, resolve, reject) => {
  // 判断x的值和promise2 是不是同一个 如果是同一个 就不要在等待了,直接出错即可
  if (promise2 === x) {
    return reject(new TypeError('chaining cycle detected for promise #<Promise>'))
  }
  //判断是不是promise
  if ((typeof x === 'object' && typeof x !== null) || typeof x === 'function') {
    let called //内部测试的时候,成功和失败都会调用
    try {
      let then = x.then //取then,有可能这个then属性是通过defineProperty来定义的
      if (typeof then === 'function') {
        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            //y可能还是一个promise
            resolvePromise(promise2, y, resolve, reject) //直到解析的值是一个普通值
            resolve(y) //采用promise的成功结果向下传递
          },
          (r) => {
            if (called) return
            called = true
            reject(r) //采用失败结果向下传递
          }
        ) //能保证不再次取用then值
      } else {
        resolve(x) //说明x是一个普通的对象,直接成功即可
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  }
}

class Promise {
  constructor(executor) {
    this.status = 'PENDING'
    this.value = undefined
    this.reason = undefined
    this.onResolvedCallbacks = []
    this.onRejectdCallbacks = []
    //如果是pendding状态,resolve状态执行返回值,并且把等待态变成成功态
    let resolve = (value) => {
      if (this.status === PENDING) {
        this.value = value
        this.status = RESOLVED
        this.onResolvedCallbacks.forEach((fn) => fn())
      }
    }
    //如果是pendding 状态,resolve妆容执行抛出异常,并且把等待态变成失败状态
    let reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason
        this.status = REJECTED
        this.onRejectdCallbacks.forEach((fn) => fn())
      }
    }
    try {
      //默认执行
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }
  then(onfulfilled, onrejected) {
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === RESOLVED) {
        setTimeout(() => {
          try {
            let x = onfulfilled(this.value)
            //x可能是promise可能是普通值
            //判断x的值 => promise2
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
          //宏任务,保证promise能够new完
        }, 0)
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onrejected(this.reason)
            //x可能是promise可能是普通值
            //判断x的值 => promise2
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
          //宏任务,保证promise能够new完
        }, 0)
      }
      if (this.status === PENDING) {
        //如果是异步,需要先订阅
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onfulfilled(this.value)
              //x可能是promise可能是普通值
              //判断x的值 => promise2
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.onRejectdCallbacks.push(() => {
          setTimeout(() => {
            //宏任务,保证promise能够new完
            try {
              let x = onrejected(this.reason)
              //x可能是promise可能是普通值
              //判断x的值 => promise2
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })
    return promise2
  }
}
```

#### 2.2 Promise.all

- 可以实现所有等待所有的异步执行完后

```js
function isPromise(){
  if(typeof value === 'object' && value !== null || typeof value === 'function'){
    if(typeof value.then  === 'function'){
      return true
    }else{
      return false
    }
  }
}



Promise.all = function(values){
  return new Promise((resolve,reject) =>[
    let arr = []
    let index = 0 //解决多个并发问题,需要使用计数器
    function processData(key,value){
      index ++;
      arr[key] = value
      if(index === values.length){
        resolve(arr)
      }
    }
    for(let i = 0; i < values.length;i++){
      let current = values[i]
      if(isPromise(current)){
        current.then((data) =>{
         processData(i,data)
        },reject)
      }else {
       processData(i,current)
      }
    }
  ])
}

```

## 高级 js

### 1.浏览器底层机制堆栈内存

1.  浏览器会在计算机内存中分配一块内存,专门用来供代码执行的=><font color="red">栈内存 ECStack</font>
2.  <font color="red">全局对象 GO</font>,浏览器会把内置对象的属性方法放到一个单独的内存中,<font color="red">堆内存</font>,开辟的内存都是一个 16 进制的内存地址,方便后期找到这个内存
3.  <font color="red">EC(执行上下文)</font>:代码自己执行所在的环境
    - 全局的执行上下文 EC(G)
    - 函数的执行上下文,函数代码独立的私有上下文中处理
    - 块级的执行上文
4.  形成的全局上下文,进入到栈内存中执行,执行完代码,可能会把形成的上下文出栈释放"出栈"
5.  <font color="red">VO 变量对象</font>:在当前上下文中,用来存放变量和值的地方(每个执行上下文都有自己的变量对象),函数私有上下文叫做<font color="red">AO 活动对象</font>,但是也是变量对象
6.  基本类型的执行操作 var a = 12
    - 创建一个值
    - 创建一个变量
    - 让变量和值关联在一起
7.  对象类型的执行操作
    - 创建一个内存
    - 把键值对存储到堆内存中
    - 把内存地址放到栈中,供变量调用
8.  函数在堆内存存储的是字符串,函数在创建的时候就定义了函数的作用域,在全局创建,作用域就是全局
9.  函数内部形成一个全新的<font color="red">私有上下文 EC(FN)</font>,供代码执行
10. 全局上下文(页面关闭销毁),压缩到栈的底部,把新的函数上下文进栈执行,放在栈的顶部
11. 执行前内部,函数自己上下文,函数的作用域,日后在私有上下文执行的时候,遇到一个遍历,首先看是否为自己的私有变量,是私有的,则操作自己的,不是沿着作用域链继续找
    - 初始化作用域链(scopeChain) <EC(FN),EC(G)>
    - 初始化 this
    - 初始化实参集合(arguments)
    - 形参赋值
    - 变量提升
    - 代码执行

### 2.闭包

- 函数执行会形成全新的私有上下文,这个上下文可能被释放,也可能不被释放,不论是否释放,它的作用是:
  - 1.保护: 划分一个独立的代码执行区域,在这个区域中有自己私有变量存储的空间,而用到的私有变量和其他区域的变量不会有任何的冲突(防止全局变量污染)
  - 2.保存:如果上下文不被销毁,那么存储的私有变量的值也不会被销毁,可以被其下级上下文调取使用
- 我们把形成私有上下文产生白村和保护的机制,称之为闭包 => 它是一种机制

### 3.parseInt 原理

- parseInt(string,radix)将一个字符串 string 转为 radix(2-36)进制的整数,把 string 看做 radix 进制,最后转成 10 进制
- radix 不在 2-36,最后都默认为 NaN

```js
parseInt('2AF5', 16)
//5*1 + 15*16 + 10*16*16 + 2*16*16*16 = 10997
```

## vue 学习

本节主要是分析 vue 源码,简易理解 vue 的源码概念

vue index.js 初始化 vue

- <font color="red">index.js</font>:指定初始化的入口

```js {6}
// 创建vue构造函数,后面可以在app.js  new Vue创建实例

import { initMixin } from './init'

function Vue(options) {
  this._init(options) //初始化操作,组件
}
//扩展原型
initMixin(Vue) //主要扩展数据挟持,对象,数组等等
```

- <font color="red">init.js</font>:指定初始化的入口

```js
import { initState } from './state'
export function initMixin(Vue) {
  const vm = this
  //后面对vue的options添加一些扩展操作,data,watch,computed......
  vm.$options = options
  //初始化数据,对数据进行挟持
  initState(vm)
}
```

- <font color="red">state.js</font>:对数据进行挟持,操作

```js
import { observe } from './oberver/index'
export function initState(vm) {
  const opts = vm.$options
  //如果配置里面data,就进行挟持
  if (opts.data) {
    initData(vm)
  }
}
function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key] // => 取值就是取 this._data.属性
    },
    set(newVal) {
      vm[source][key] = newValue // =>赋值实际就是 this.属性 =>this._data.属性
    },
  })
}

function isFunction(data) {
  return typeof data === 'function'
}
function initData(vm) {
  let data = vm.$option.data
  //判断数据是不是函数 ...此处 data(){return{}},
  data = vm._data
  isFunction(data) ? data.call(vm) : data
  // 对数据做一层代理,主要是把所有数据 this._data => this.属性
  for (let key in data) {
    proxy(vm, '_data', key)
  }
  //数据挟持
  observe(data)
}
```

- <font color="red">observe(index.js)</font>:对数据进行挟持,操作

```js
import { arrayMethods } from './observe/array.js'
class Observe {
  constructor(data) {
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false, // 不可枚举的
    })
    // data.__ob__ = this; // 所有被劫持过的属性都有__ob__,需要绕开这个属性,不让这个属性被观察
    if (Array.isArray(data)) {
      //对数组原来的方法进行改写,切片编程,高阶函数
      data._proto_ = arrayMethods
      this.observeArray(data) //对数组进行挟持
    } else {
      this.walk(data) //数据挟持操作
    }
  }
  observeArray() {
    data.forEach((item) => observe(item))
  }
  walk(data) {
    //遍历所有键名,进行挟持
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key])
    })
  }
}

function defineReactive(data, key, value) {
  //value可能是对象
  observe(value) //本身用户默认值是对象的话,需要递归处理
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newValue) {
      //在这里可以进行更新视图等等
      observe(newValue) //如果用户赋值一个新对象 ，需要将这个对象进行劫持
      value = newValue
    },
  })
}

function observe(data) {
  if (!isObject(data)) return
  if (data.__ob__) return
  return new Observer(data)
}
```

- <font color="red">observe(array.js)</font>:对数组方法进行改写

```js
let oldArrayPrototype = Array.prototype

//arrayMethods._proto_ = Array.prototype 继承
export let arrayMethods = Object.create(oldArrayMethods)

let methods = ['push', 'unshift', 'shift', 'pop', 'reverse', 'sort', 'splice']

methods.forEach((method) => {
  arrayMethods[method] = function (...args) {
    //  args 是参数列表(伪数组) arr.push(1,2,3)
    oldArrayPrototype[method].call(this, ...args) //实际要改变this指向,是数组调用push

    let inserted
    let ob = this.__ob__ //根据当前数组获取到observer实例,此时谁调用,这个this就是vue实例
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break;
      case 'splice':
        inserted = args.slice(2) ,//参数列表第三项是新增的值 arr.splice(0,1,xxxx)
       default:
         break;
    }
     // 如果有新增的内容要进行继续劫持, 我需要观测的数组里的每一项，而不是数组
    if(inserted) ob.observeArray(inserted)
  }
})
```

- <h3>vue编译流程解析</h3>

1. 获取模板内容

```js
const vm = this
const options = vm.$options
el = document.querySelector(el)
vm.$el = el
// 把模板转化成 对应的渲染函数 =》 虚拟dom概念 vnode =》 diff算法 更新虚拟dom =》 产生真实节点，更新
if (!options.render) {
  // 没有render用template，目前没render
  let template = options.template
  if (!template && el) {
    // 用户也没有传递template 就取el的内容作为模板
    template = el.outerHTML
    let render = compileToFunction(template)
    options.render = render
  }
}
//
```

2. 把 html 字符串通过正则处理形成 ast 解析树,形成有结构的树形结构
3. 通过遍历树,将树拼接成字符串

```js
//  _c('div',{id:'app',a:1},_c('span',{},'world'),_v())
```

4. 通过 render 函数 + (with + new Function) 生成虚拟 dom

```js
export function compileToFunction(template) {
  let root = parserHTML(template)

  // 生成代码
  let code = generate(root)

  let render = new Function(`with(this){return ${code}}`) // code 中会用到数据 数据在vm上

  return render
  // render(){
  //     return
  // }
  // html=> ast（只能描述语法 语法不存在的属性无法描述） => render函数 + (with + new Function) => 虚拟dom （增加额外的属性） => 生成真实dom
}
```

5. 生成虚拟 dom
6. 生成真实 dom

```js
export function patch(oldVnode, vnode) {
  if (oldVnode.nodeType == 1) {
    // 用vnode  来生成真实dom 替换原本的dom元素
    const parentElm = oldVnode.parentNode // 找到他的父亲
    let elm = createElm(vnode) //根据虚拟节点 创建元素

    // 在第一次渲染后 是删除掉节点，下次在使用无法获取
    parentElm.insertBefore(elm, oldVnode.nextSibling)

    parentElm.removeChild(oldVnode)

    return elm
  }
}

function createElm(vnode) {
  let { tag, data, children, text, vm } = vnode
  if (typeof tag === 'string') {
    // 元素
    vnode.el = document.createElement(tag) // 虚拟节点会有一个el属性 对应真实节点
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}
```
