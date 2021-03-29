---
title: 前端面试题
sidebarDepth: 3
---

# 前端面试题

## 一.js

### 一.js 数据类型检测

#### 1. typeof

- 直接在计算机底层基于<font color="red">**数据类型的值(二进制)**</font>进行检测
- 检测结果是个字符串
- typeof underfined === 'underfined';
- typeof null === 'object' <font color="red">**对象存储**</font>在计算机中都是以<font color="red">**000 开始的二进制存储**</font>,null 也是,所以检测出来都是对象
- typeof 普通对象/数组对象/正则对象/日期对象 "object"
- typeof 适合基本数据类型检测

#### 2.instance of

- instance of 检测当前实例是否属于这个类
- 只要出现当前类的原型链上,结果都是 true
- 由于我们可以肆意修改原型链的指向,所以检测结果都是不准确的
- 不能检测基本数据类型

```js
let arr = []
console.log(arr instanceof Array) // => true
console.log(arr instanceof RegExp) // =>false 原型链没有
console.log(arr instanceof Object) // =>true

function instance_of(example, classFunc) {
  let classFunPrototype = classFunc.prototype
  proto = Object.getPrototypeOf(example) //example._proto_
  while (true) {
    if (proto === null) {
      //Object.prototype._proto_ =>null
      return false
    }
    if (proto === classFunPrototype) {
      return true
    }
    proto = Object.getPrototypeOf(proto)
  }
}
```

#### 3.constructor

- 用起来比 instanceof 好用一些(可以支持基本类型)
- 也可以随便修改原型链

```js
let n = 1
console.log(n.constructor === Number) //true

Number.prototype.constructor == 'AA'

let a = 1
console.log(a.constructor === Number) //false
```

#### 4.Object.prototype.toString.call([value])

- 标准检测数据:Object.prototype.toString 不是转换成字符串,是返回当前实例所属类的信息
- 检测方法"[object Number/String/Boolean/Null/Underfined/Null/Symbol/RegExp/Date/Function]"

Object.prototype.toString.call([]) === "[obejct Array]"

```js
//原生实现等同于Object.prototype.toString.call

;(function () {
  var class2type = {}
  var toString = class2type.toString //=> Object.prototype.toString
  //设定数据类型的映射表
  ;['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error', 'Symbol'].forEach((name) => {
    class2type[`[object${name}`] = name.toLowerCase()
  }),
    function toType() {
      if (obj == null) {
        return obj + ''
      }
      return typeof obj === 'object' || typeof obj === 'function' ? class2type[toString.call(obj)] || 'object' : typeof obj
    }

  window.toType = toType
})()
```

### 二.JS 三类循环对比和性能对比

#### 1.for 循环&&while

- for 循环和 while 循环都是交给浏览器底层机制去实现的,跟电脑等性能有关系,所有得到结果时间不固定,但是可以预估大概时间
- 基于 var 声明的时候,for 循环和 while 循环性能差不多,不确定循环次数用使用 while
- 基于 let 声明的时候,for 循环的性能更好,(没有创作全局不释放的变量,因为 var 声明是没有块级作用域的概念)

```js
let i = 0
//全局变量
while (i < arr.length) {
  i++
}
```

#### 2.foreach

- 开发中多利用 foreach,相比于 for 循环命令式编程无法管控过程,函数式编程更注重做了什么,foreach 消耗性能消耗较高

```js
 //原生实现数组原型的方法
 Array.prototype.forEach(callback,context){
     //this = arr
     let that = this,
         len = that.length
      context = context === null ? window : context

    for(i = 0; i < len;i++){
        typeof callback === 'function' ? callback(context,that[i],i) : null
    }
 }


```

#### 3.for in

- for in 循环的性能很差;迭代相当对象中所有可枚举的属性[私有属性大部分可枚举的,公有属性(出现在所属类的原型上的)也有部分可枚举的],查找机制一定会搞到原型链上面
- for in 循环遍历顺序数字优先,从小到大
- for in symbol 无法遍历
- for in 遍历到公有中可枚举的属性

```js
//解决查找问题
for (key in obj) {
  if (!obj.hasOwnProperty(key)) break
}

let keys = Object.keys(obj)
if (typeof Symbol !== 'underfined') {
  keys = keys.concat(Object.getOwnPropertySymbol(obj))
}
```

#### 4.for of

- for of 循环遵循 iterator 的规范,含有[symbol.iteartor]

```js
 //让对象能够拥有可迭代属性
 obj[Symbol.iterator] = Array.prototype[Symbol.iterator];
 for(let var of obj){
    console.log(var)
 }
```

### 三.this 的场景

- 函数执行,看方法有没有点,没有点,this 是 window[严格模式是 underfined],有点看点前面是谁,this 就是谁
- 给当前元素某个事件行为绑定方法,方法的 this 是当前本身,排除 attachEvent
- 构造函数 this 是当前类的实例
- 箭头函数 this 没有执行主体,this 是所处上下文中的 this
- call 内部原理:利用"点"的机制
- bind 函数内部实现:并没有立即实行函数

1. 把传递进来的 obj/参数等信息存储(闭包)
2. 执行 bind 返回一个新的函数,比如:把 proxy 绑定给元素的事件,当事件触发执行返回的 proxy,在 proxy 内部,再去执行 function,把 this 改成之前存储的那些内容

```js
//bind方法
 //1.把function中的this改为obj
 // 2.把参数接受的值当做实参传给function函数
 // 3.让function函数立即执行
 // context.xxx =  self    obj.xxx = function => obj.xxx()
 Function.prototype.call = function call(context, ...params){
     let self = this,
         key = Symbol("KEY),
         result;
         context == null ? context = window : null;
         //如果传入数字的context
         /^(object| function)$/.test(typeof context) ? context = Object(context) : null
         context[key] = self
         result = context[key](...params)
         delete context[key]
     return result
 }

 Function.prototype.bind = function bind(context,params){
     let self = this
     return function proxy(...arg){
       self.apply(context,params.concat(args));
     }
 }

 //柯里化思想,内部存储不执行
```

### 四. 基于 HTTP 网络层的性能优化

- encodeURL/decodeURL 度整个 URL 编码,处理空格/中文
- encodeURLComponent/decodeURLComponent 主要对传递参数信息编码

<font color="red">**流程**</font>

#### 1. url 解析

- 地址解析 ![](/images/url.jpeg)

- 编码

#### 2. 缓存检查

- Memory Cache : 内存缓存
- Disk Cache：硬盘缓存

打开网页：查找 disk cache 中是否有匹配，如有则使用，如没有则发送网络请求<br> 普通刷新 (F5)：因 TAB 没关闭，因此 memory cache 是可用的，会被优先使用，其次才是 disk cache<br> 强制刷新 (Ctrl + F5)：浏览器不使用缓存，因此发送的请求头部均带有 Cache-control: no-cache，服务器直接返回 200 和最新内容

浏览器对于强缓存的处理：根据第一次请求资源时返回的响应头来确定的

- <font color="red">**Expires**</font>：缓存过期时间，用来指定资源到期的时间（HTTP/1.0）

- <font color="red">**Cache-Control**</font>：cache-control: max-age=2592000 第一次拿到资源后的 2592000 秒内（30 天），再次发送请求，读取缓存中的信息（HTTP/1.1）

两者同时存在的话，Cache-Control 优先级高于 Expires

- <font color="red">**强缓存和协商缓存**</font>
- 强缓存一般都有谁本地有直接拿,不需要从服务器获取先检查是否存在强缓存
- 有,且未失效,走强缓存
- 如果没有,或者失效坚持是否有协商缓存
- 没有的话获取最新数据
- html 一般不走强缓存

- <font color="red">**协商缓存和强缓存区别**</font>
- 协商缓存总会和服务器协商,所以一定要发 http 请求的

- <font color="red">**解决强缓存后资源更新问题**</font>
- 文件名加后缀
- 告别强缓存,使用协商缓存

- <font color="red">**协商缓存**</font>
- 第一次向服务器发请求:如果没有协商缓存,此时向服务器发请求(没有传递标识),服务器收到请求内容准备 Last-Modified:资源文件更新最后时间 ETag:记录一个标识(更新资源文件自动生成,每一次更新资源都会生成一个 ETag)
- 第二次发请求 if-modified-since = Last-Modified if-none-match : ETag
- 客户端拿到资源后把信息缓存到本地
- 因为 Last-Modified 只能更新到秒,如果同时完成资源返回和更新,所以需要额外的 ETag
- 304 就是协商缓存

> <font color="red">**强缓存**</font>

![](/images/a.jpeg)

> <font color="red">**协商缓存**</font>

![](/images/b.jpeg)

> <font color="red">**数据请求**</font>

![](/images/c.jpeg)

#### 3. DNS 解析

- 递归查询
- 迭代查询 ![](/images/d.jpeg)

- 关于前端优化
- 减少 DNS 请求次数
- DNS 预获取（DNS Prefetch)

```html
<meta http-equiv="x-dns-prefetch-control" content="on" />
<link rel="dns-prefetch" href="//static.360buyimg.com" />
<link rel="dns-prefetch" href="//misc.360buyimg.com" />
<link rel="dns-prefetch" href="//img10.360buyimg.com" />
<link rel="dns-prefetch" href="//d.3.cn" />
<link rel="dns-prefetch" href="//d.jd.com" />
```

::: tip 提示

服务器拆分的优势 资源的合理利用 抗压能力加强 提高 HTTP 并发

:::

#### 4. TCP 三次握手

- seq 序号，用来标识从 TCP 源端向目的端发送的字节流，发起方发送数据时对此进行标记
- ack 确认序号，只有 ACK 标志位为 1 时，确认序号字段才有效，ack=seq+1
- 标志位
  - ACK：确认序号有效
  - RST：重置连接
  - SYN：发起一个新连接
  - FIN：释放一个连接 ![](/images/f.jpeg)

::: warning 注意

三次握手为什么不用两次，或者四次?

TCP 作为一种可靠传输控制协议，其核心思想：既要保证数据可靠传输，又要提高传输的效率！

:::

#### 5.数据传输

- 请求报文
- 响应报文

- 响应状态码

  - 200 OK
  - 202 Accepted ：服务器已接受请求，但尚未处理（异步）
  - 204 No Content：服务器成功处理了请求，但不需要返回任何实体内容
  - 206 Partial Content：服务器已经成功处理了部分 GET 请求（断点续传 Range/If-Range/Content-Range/Content-Type:”multipart/byteranges”/Content-Length….）
  - 301 Moved Permanently
  - 302 Move Temporarily
  - 304 Not Modified
  - 305 Use Proxy
  - 400 Bad Request : 请求参数有误
  - 401 Unauthorized：权限（Authorization）
  - 404 Not Found
  - 405 Method Not Allowed
  - 408 Request Timeout
  - 500 Internal Server Error
  - 503 Service Unavailable
  - 505 HTTP Version Not Supported

#### 6. TCP 四次挥手

![](/images/g.jpeg)

::: warning 注意 为什么连接的时候是三次握手，关闭的时候却是四次握手？

- 服务器端收到客户端的 SYN 连接请求报文后，可以直接发送 SYN+ACK 报文
- 但关闭连接时，当服务器端收到 FIN 报文时，很可能并不会立即关闭链接，所以只能先回复一个 ACK 报文，告诉客户端：”你发的 FIN 报文我收到了”，只有等到服务器端所有的报文都发送完了，我才能发送 FIN 报文，因此不能一起发送，故需要四步握手。

:::

#### HTTP1.0 和 HTTP1.1 的一些区别

- <font color="skyblue">**缓存处理**</font>，HTTP1.0 中主要使用 Last-Modified，Expires 来做为缓存判断的标准，HTTP1.1 则引入了更多的缓存控制策略：ETag，Cache-Control…

- <font color="skyblue">**带宽优化及网络连接的使用**</font>，HTTP1.1 支持断点续传，即返回码是 206（Partial Content）

- <font color="skyblue">**带宽优化及网络连接的使用**</font>错误通知的管理，在 HTTP1.1 中新增了 24 个错误状态响应码，如 409（Conflict）表示请求的资源与资源的当前状态发生冲突；410（Gone）表示服务器上的某个资源被永久性的删除…

- <font color="skyblue">**Host 头处理**</font>，在 HTTP1.0 中认为每台服务器都绑定一个唯一的 IP 地址，因此，请求消息中的 URL 并没有传递主机名（hostname）。但随着虚拟主机技术的发展，在一台物理服务器上可以存在多个虚拟主机（Multi-homed Web Servers），并且它们共享一个 IP 地址。HTTP1.1 的请求消息和响应消息都应支持 Host 头域，且请求消息中如果没有 Host 头域会报告一个错误（400 Bad Request）

- <font color="skyblue">**长连接**</font>，HTTP1.1 中默认开启 Connection： keep-alive，一定程度上弥补了 HTTP1.0 每次请求都要创建连接的缺点

#### HTTP2.0 和 HTTP1.X 相比的新特性

- <font color="green">**新的二进制格式（Binary Format）**</font>，HTTP1.x 的解析是基于文本，基于文本协议的格式解析存在天然缺陷，文本的表现形式有多样性，要做到健壮性考虑的场景必然很多，二进制则不同，只认 0 和 1 的组合，基于这种考虑 HTTP2.0 的协议解析决定采用二进制格式，实现方便且健壮

- <font color="green">**header 压缩**</font>，HTTP1.x 的 header 带有大量信息，而且每次都要重复发送，HTTP2.0 使用 encoder 来减少需要传输的 header 大小，通讯双方各自 cache 一份 header fields 表，既避免了重复 header 的传输，又减小了需要传输的大小

- <font color="green">**服务端推送（server push）**</font>，例如我的网页有一个 sytle.css 的请求，在客户端收到 sytle.css 数据的同时，服务端会将 sytle.js 的文件推送给客户端，当客户端再次尝试获取 sytle.js 时就可以直接从缓存中获取到，不用再发请求了

```js
// 通过在应用生成HTTP响应头信息中设置Link命令
Link: </styles.css>; rel=preload; as=style, </example.png>; rel=preload; as=image

```

- 多路复用（MultiPlexing）

```html
- HTTP/1.0 每次请求响应，建立一个TCP连接，用完关闭 - HTTP/1.1 「长连接」 若干个请求排队串行化单线程处理，后面的请求等待前面请求的返回才能获得执行机会，一旦有某请求超时等，后续请求只能被阻塞，毫无办法，也就是人们常说的线头阻塞； - HTTP/2.0 「多路复用」多个请求可同时在一个连接上并行执行，某个请求任务耗时严重，不会影响到其它连接的正常执行；
```

### 五. 拷贝

#### 1.数字浅拷贝

1. 结合扩展运算符 let newArr = [...arr]
2. newArr = arr.concat([])
3. newArr = arr.slice()

#### 2.对象的浅拷贝

1. 结合扩展运算符 let newObj= {...obj}
2. newObj = Object.assign({},obj)
3. 自己 for in 循环不支持对 Symbol 的遍历(1 和 2 可以)

::: tip 提示

Object.keys(obj)只能获取非 symbol 属性 Object.getOwnPropertySymbol(obj)只能获取 symbol 属性 二者可以结合

:::

```js
//toType 函数
;(function () {
  var class2type = {}
  var toString = class2type.toString //=> Object.prototype.toString
  //设定数据类型的映射表
  ;['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error', 'Symbol'].forEach((name) => {
    class2type[`[object${name}`] = name.toLowerCase()
  }),
    function toType() {
      if (obj == null) {
        return obj + ''
      }
      return typeof obj === 'object' || typeof obj === 'function' ? class2type[toString.call(obj)] || 'object' : typeof obj
    }

  window.toType = toType
})()

// 检测是否为数据或者类数组
const isArrayLike = function isArrayLike(obj) {
  let length = !!obj && 'length' in obj && obj.length,
    type = toType(obj)
  if (isFunction(obj) || isWindow(obj)) return false
  return type === 'array' || length === 0 || (typeof length === 'number' && length > 0 && length - 1 in obj)
}

// 遍历数组/类数组/对象
const each = function each(obj, callback) {
  callback = callback || Function.prototype
  if (isArrayLike(obj)) {
    for (let i = 0; i < obj.length; i++) {
      let item = obj[i],
        result = callback.call(item, item, i)
      if (result === false) break
    }
    return obj
  }
  for (let key in obj) {
    if (!hasOwn.call(obj, key)) break
    let item = obj[key],
      result = callback.call(item, item, key)
    if (result === false) break
  }
  return obj
}

// 浅克隆

function shallowClone(obj) {
  let type = _.toType(obj),
    Ctor = obj.constructor

  // 对于Symbol/BigInt
  if (/^(symbol|bigint)$/i.test(type)) return Object(obj)

  // 对于正则/日期的处理
  if (/^(regexp|date)$/i.test(type)) return new Ctor(obj)

  // 对于错误对象的处理
  if (/^error$/i.test(type)) return new Ctor(obj.message)

  // 对于函数
  if (/^function$/i.test(type)) {
    // 返回新函数：新函数执行还是把原始函数执行，实现和原始函数相同的效果
    return function () {
      return obj.call(this, ...arguments)
    }
  }

  // 数组或者对象
  if (/^(object|array)$/i.test(type)) {
    let keys = [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)],
      result = new Ctor()
    _.each(keys, (key) => {
      result[key] = obj[key]
    })
    return result
    /* let result = new Ctor();
        _.each(obj, (_, key) => {
            result[key] = obj[key];
        });
        return result; */

    /* // Symbol属性
        return type === "array" ? [...obj] : {
            ...obj
        }; */
  }

  return obj
}

// 深克隆：只要有下一级的，我们就克隆一下（浅克隆）
function deepClone(obj, cache = new Set()) {
  let type = _.toType(obj),
    Ctor = obj.constructor
  if (!/^(object|array)$/i.test(type)) return shallowClone(obj)

  // 避免无限套娃
  if (cache.has(obj)) return obj
  cache.add(obj)

  let keys = [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)],
    result = new Ctor()
  _.each(keys, (key) => {
    // 再次调用deepClone的时候把catch传递进去，保证每一次递归都是一个cache
    result[key] = deepClone(obj[key], cache)
  })
  return result
}
```

### 六. 基于浅比较实现的对象的合并

```js
/*
 * 几种情况的分析
 *   A->options中的key值  B->params中的key值
 *   1.A&B都是原始值类型:B替换A即可
 *   2.A是对象&B是原始值:抛出异常信息
 *   3.A是原始值&B是对象:B替换A即可
 *   4.A&B都是对象:依次遍历B中的每一项,替换A中的内容
 */
// params替换options
function isObj(value) {
  // 是否为普通对象
  return _.toType(value) === 'object'
}

function merge(options, params = {}) {
  _.each(params, (_, key) => {
    let isA = isObj(options[key]),
      isB = isObj(params[key])
    if (isA && !isB) throw new TypeError(`${key} in params must be object`)
    if (isA && isB) {
      options[key] = merge(options[key], params[key])
      return
    }
    options[key] = params[key]
  })
  return options
}
```

### 七. AOP 切面编程

- 它所面对的是处理过程中的某个步骤或阶段，以获得逻辑过程中各部分之间低耦合性的隔离效果(目的是降低耦合)。 具体到实现来说就是通过动态的方式将非主关注点部分插入到主关注点(一般是业务逻辑中)

```js
Function.prototype.before = function before(callback) {
  if (typeof callback != 'function') throw new TypeError('callback must be function')
  //this => fun
  let _self = this
  return function proxy(...params) {
    callback.call(this, ...params)
    return _self.call(this, ...params)
  }
}

Function.prototype.after = function after(callback) {
  if (!typeof callback != 'function') throw new TypeError('callback must be function')
  let _self = this
  return function proxy(...params) {
    let res = _self.call(this, ...params)
    callback.call(this, ...params)
    return res
  }
}

let fun = () => {
  console.log('function')
}
func
  .before(() => {
    console.log('===before===')
  })
  .after(() => {
    console.log('===after===')
  })()
```

### 八. 前端设计模式

#### 1.单例模式

- 基于单独的实例,来管理某一个模块中的内容,实现模块之间的独立划分[但是也可以通过模块之间方法的相互调用]

```js
var AModule = function () {
  var data = []
  function bindHTML() {}
  function change() {}

  return {
    change: change,
  }
}

//转成命令模式
let SearchModule = function () {
  let body = document.body
  function querydata() {}
  function handle() {}

//相当于大脑,按指定执行
  return {
    init: function () {
      querydata()
      handle()
    },
  }
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

let AMdodule = (function(){
  let arr = []
  let change = function change(val){
    arr.push(val)
  }

  return{
    change:change
  }
})

AMdodule.change(10)
AMdodule.change(10)

//此时执行出现污染,都修改相同东西

//使用构造器的模式
class  AModule{
 constructor()}
  this.arr = []

  change(val){
    this.arr.push(val)
    console.log(this.arr)
  }
}

let A1 = new AModule(10)
let A2 = new AModule(20)
//这样就不会出现污染
```

#### 2.工厂模式

- 工厂模式:工厂可以帮助我们实现调用的切换,或者实现一些中转的处理(中转站)

```js
function factory(options){
  options = options || {}
  let {type,payload} = options
  if(type === 'array'){
    return
    //执行
  }
  //执行b完成其他的逻辑

  factory({
    type:'object'
    payload:'zhufeng'
  })

    factory({
    type:'array'
    payload:'zhufeng'
  })
}


```

#### 3.观察者模式

- vue 2.0 响应式原理使用到的模式

```js
//观察者
 class Observer(){
   update(message){
     console.log('消息接收!',message)
   }
 }
 class Demo(){
      update(message){
     console.log('消息接收!',message)
   }
 }

 //目标:管理观察者
class ObserverList{
  constructor(){
    this.observerList = []
  }
  add(observer){
    return observerList.push(observer)
  }
  remove(observer){
    this.observerList.remove(observer)
  }
  notify(){

  }

}
let sub = new Subject;
sub.add(new Observer)
sub.add(new Observer)
sub.add(new Observer)

setTimeout(()=>{
  sub.notity('你好啊')
},1000)

```

![](/images/observe.png)

#### 4.发布订阅模式

- 给当前元素的某一事件行为,绑定多个不同的方法[事假池机制]
- 事件行为触发,会依次通知事件池方法的执行
- DOM 0 级事件就是类似于属性绑定,给 onclick 属性绑定方法
- DOM 2 级事件是 addEventListner,可以往事件池里面加方法
- 应用场景: 凡是某个阶段到达的时候,需要执行很多方法,到底执行多少个不确定,我们都可以利用基于发布订阅模式来管理代码:创建事件池=>相当于发布计划,向事件池里面添加方法=>向计划表中订阅任务 fire=>通知计划表中任务的执行

```js
class Sub{
  pond = []

  //型上设置方法:向事件池中订阅任务
  subscribe(func){
    let  self = this
    pond = self.pond
    if(!pond.include(func) pond.push(func))
    return function unsubscribe(){
      let i = 0
      len = pond.length
      item = null
      for(; i < len; i++){
        item = pond[i]
        if(item = pond[i]){
           pond.splice(i,1)
           break;
        }
      }
    }
  }
}
// 通知当前实例所属事件池中的任务执行
fire(...params){
  let self = this
  pond = self.pond;
  pond.forEach(item =>{
     if(typeof item === "function"){
       item(...params)
     }
  })
}




let sub1 = new Sub;
sub1.subscribe(function(){
  console.log(111)
})
```

### 九. 基于 Ajax 的并发请求
