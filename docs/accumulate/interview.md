---
title: 前端面试题
sidebarDepth: 3
---


# 前端面试题

## 一.js
### 一.js数据类型检测
####  1. typeof

* 直接在计算机底层基于<font color="red">**数据类型的值(二进制)**</font>进行检测
* 检测结果是个字符串
* typeof underfined === 'underfined'; 
* typeof null === 'object' <font color="red">**对象存储**</font>在计算机中都是以<font color="red">**000开始的二进制存储**</font>,null也是,所以检测出来都是对象
* typeof 普通对象/数组对象/正则对象/日期对象 "object"
* typeof 适合基本数据类型检测

#### 2.instance of 
* instance of 检测当前实例是否属于这个类
* 只要出现当前类的原型链上,结果都是true
* 由于我们可以肆意修改原型链的指向,所以检测结果都是不准确的
* 不能检测基本数据类型

```js
 let arr = []
 console.log(arr instanceof Array) // => true
 console.log(arr instanceof RegExp) // =>false 原型链没有
 console.log(arr instanceof Object) // =>true


 function instance_of(example,classFunc){
   let classFunPrototype = classFunc.prototype
   proto = Object.getPrototypeOf(example) //example._proto_
   while (true){
       if(proto === null){
           //Object.prototype._proto_ =>null
           return false
       }
       if(proto === classFunPrototype){
           return true
       }
       proto =  Object.getPrototypeOf(proto) 
   }


 }

```
#### 3.constructor
* 用起来比instanceof好用一些(可以支持基本类型)
* 也可以随便修改原型链

```js
let n = 1
console.log(n.constructor === Number) //true

Number.prototype.constructor == 'AA'

let a = 1
console.log(a.constructor === Number) //false

 
```

#### 4.Object.prototype.toString.call([value])
* 标准检测数据:Object.prototype.toString不是转换成字符串,是返回当前实例所属类的信息
* 检测方法"[object Number/String/Boolean/Null/Underfined/Null/Symbol/RegExp/Date/Function]"

Object.prototype.toString.call([]) === "[obejct Array]"



```js
 //原生实现等同于Object.prototype.toString.call

 (function(){
   var class2type = {};
   var toString = class2type.toString; //=> Object.prototype.toString
   //设定数据类型的映射表
   ["Boolean","Number","String","Function","Array","Date","RegExp","Object","Error","Symbol"].forEach(name =>{
       class2type[`[object${name}`] = name.toLowerCase();
   }),

   function toType(){
    if(obj == null){
        return obj + ""
    }
    return typeof obj === "object" || typeof obj === "function" ? 
        class2type[toString.call(obj)] || "object" : typeof obj
    }

    window.toType = toType
 })()



```


### 二.JS三类循环对比和性能对比

#### 1.for循环&&while
* for循环和while循环都是交给浏览器底层机制去实现的,跟电脑等性能有关系,所有得到结果时间不固定,但是可以预估大概时间
* 基于var声明的时候,for循环和while循环性能差不多,不确定循环次数用使用while
* 基于let声明的时候,for循环的性能更好,(没有创作全局不释放的变量,因为var声明是没有块级作用域的概念)

```js
let i = 0;
//全局变量
while(i < arr.length){
    i++;
}
```

#### 2.foreach
* 开发中多利用foreach,相比于for循环命令式编程无法管控过程,函数式编程更注重做了什么,foreach消耗性能消耗较高

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
* for in循环的性能很差;迭代相当对象中所有可枚举的属性[私有属性大部分可枚举的,公有属性(出现在所属类的原型上的)也有部分可枚举的],查找机制一定会搞到原型链上面
* for in循环遍历顺序数字优先,从小到大
* for in symbol无法遍历
* for in 遍历到公有中可枚举的属性

```js
 //解决查找问题
 for(key in obj){
     if(!obj.hasOwnProperty(key)) break;
 }
  
  let keys = Object.keys(obj)
  if(typeof Symbol !== 'underfined'){
    keys = keys.concat(Object.getOwnPropertySymbol(obj));
  }
```

#### 4.for of
* for of循环遵循iterator的规范,含有[symbol.iteartor]
```js
 //让对象能够拥有可迭代属性
 obj[Symbol.iterator] = Array.prototype[Symbol.iterator];
 for(let var of obj){
    console.log(var)
 }
```

### 三.this的场景
* 函数执行,看方法有没有点,没有点,this是window[严格模式是underfined],有点看点前面是谁,this就是谁
* 给当前元素某个事件行为绑定方法,方法的this是当前本身,排除attachEvent
* 构造函数this是当前类的实例
* 箭头函数this没有执行主体,this是所处上下文中的this
* call内部原理:利用"点"的机制
* bind函数内部实现:并没有立即实行函数
1. 把传递进来的obj/参数等信息存储(闭包)
2. 执行bind返回一个新的函数,比如:把proxy绑定给元素的事件,当事件触发执行返回的proxy,在proxy内部,再去执行function,把this改成之前存储的那些内容

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

 Function.prototype.bind = function bind(){
     let self = this
     return function proxy(){
       self.apply(context,params);  
     }
 }

 //柯里化思想,内部存储不执行
```

### 四. 基于HTTP网络层的性能优化

* encodeURL/decodeURL 度整个URL编码,处理空格/中文
* encodeURLComponent/decodeURLComponent  主要对传递参数信息编码


 <font color="red">**流程**</font>

####  1. url解析
* 地址解析
![](/images/url.jpeg)

* 编码


####  2. 缓存检查
* Memory Cache : 内存缓存
* Disk Cache：硬盘缓存

打开网页：查找 disk cache 中是否有匹配，如有则使用，如没有则发送网络请求<br>
普通刷新 (F5)：因TAB没关闭，因此memory cache是可用的，会被优先使用，其次才是disk cache<br>
强制刷新 (Ctrl + F5)：浏览器不使用缓存，因此发送的请求头部均带有 Cache-control: no-cache，服务器直接返回 200 和最新内容


浏览器对于强缓存的处理：根据第一次请求资源时返回的响应头来确定的

* <font color="red">**Expires**</font>：缓存过期时间，用来指定资源到期的时间（HTTP/1.0）

* <font color="red">**Cache-Control**</font>：cache-control: max-age=2592000第一次拿到资源后的2592000秒内（30天），再次发送请求，读取缓存中的信息（HTTP/1.1）

两者同时存在的话，Cache-Control优先级高于Expires

* <font color="red">**强缓存和协商缓存**</font>
* 强缓存一般都有谁本地有直接拿,不需要从服务器获取
  先检查是否存在强缓存
* 有,且未失效,走强缓存
* 如果没有,或者失效坚持是否有协商缓存
* 没有的话获取最新数据
* html一般不走强缓存

* <font color="red">**协商缓存和强缓存区别**</font>
* 协商缓存总会和服务器协商,所以一定要发http请求的

* <font color="red">**解决强缓存后资源更新问题**</font> 
* 文件名加后缀
* 告别强缓存,使用协商缓存


* <font color="red">**协商缓存**</font>
* 第一次向服务器发请求:如果没有协商缓存,此时向服务器发请求(没有传递标识),服务器收到请求内容准备
Last-Modified:资源文件更新最后时间
ETag:记录一个标识(更新资源文件自动生成,每一次更新资源都会生成一个ETag)
* 第二次发请求 if-modified-since = Last-Modified
  if-none-match : ETag 
* 客户端拿到资源后把信息缓存到本地
* 因为Last-Modified只能更新到秒,如果同时完成资源返回和更新,所以需要额外的ETag
* 304就是协商缓存

>  <font color="red">**强缓存**</font>

![](/images/a.jpeg)

>  <font color="red">**协商缓存**</font>

![](/images/b.jpeg)

>  <font color="red">**数据请求**</font>

![](/images/c.jpeg)


####  3. DNS解析

* 递归查询
* 迭代查询
![](/images/d.jpeg)

* 关于前端优化
* 减少DNS请求次数
* DNS预获取（DNS Prefetch)

```html
<meta http-equiv="x-dns-prefetch-control" content="on">
<link rel="dns-prefetch" href="//static.360buyimg.com"/>
<link rel="dns-prefetch" href="//misc.360buyimg.com"/>
<link rel="dns-prefetch" href="//img10.360buyimg.com"/>
<link rel="dns-prefetch" href="//d.3.cn"/>
<link rel="dns-prefetch" href="//d.jd.com"/>

```


::: tip 提示
   服务器拆分的优势
   资源的合理利用
   抗压能力加强
   提高HTTP并发
 :::


####  4. TCP三次握手

* seq序号，用来标识从TCP源端向目的端发送的字节流，发起方发送数据时对此进行标记
* ack确认序号，只有ACK标志位为1时，确认序号字段才有效，ack=seq+1
* 标志位
  - ACK：确认序号有效
  - RST：重置连接
  - SYN：发起一个新连接
  - FIN：释放一个连接
![](/images/f.jpeg)


::: warning 注意
   三次握手为什么不用两次，或者四次?

   TCP作为一种可靠传输控制协议，其核心思想：既要保证数据可靠传输，又要提高传输的效率！
 :::

 ####  5.数据传输

 * 请求报文
 * 响应报文

 * 响应状态码

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


#### 6. TCP四次挥手

![](/images/g.jpeg)


::: warning 注意
   为什么连接的时候是三次握手，关闭的时候却是四次握手？

  * 服务器端收到客户端的SYN连接请求报文后，可以直接发送SYN+ACK报文
  * 但关闭连接时，当服务器端收到FIN报文时，很可能并不会立即关闭链接，所以只能先回复一个ACK报文，告诉客户端：”你发的FIN报文我收到了”，只有等到服务器端所有的报文都发送完了，我才能发送FIN报文，因此不能一起发送，故需要四步握手。


 :::


#### HTTP1.0和HTTP1.1的一些区别

* <font color="skyblue">**缓存处理**</font>，HTTP1.0中主要使用 Last-Modified，Expires 来做为缓存判断的标准，HTTP1.1则引入了更多的缓存控制策略：ETag，Cache-Control…

* <font color="skyblue">**带宽优化及网络连接的使用**</font>，HTTP1.1支持断点续传，即返回码是206（Partial Content）

* <font color="skyblue">**带宽优化及网络连接的使用**</font>错误通知的管理，在HTTP1.1中新增了24个错误状态响应码，如409（Conflict）表示请求的资源与资源的当前状态发生冲突；410（Gone）表示服务器上的某个资源被永久性的删除…

* <font color="skyblue">**Host头处理**</font>，在HTTP1.0中认为每台服务器都绑定一个唯一的IP地址，因此，请求消息中的URL并没有传递主机名（hostname）。但随着虚拟主机技术的发展，在一台物理服务器上可以存在多个虚拟主机（Multi-homed Web Servers），并且它们共享一个IP地址。HTTP1.1的请求消息和响应消息都应支持Host头域，且请求消息中如果没有Host头域会报告一个错误（400 Bad Request）

* <font color="skyblue">**长连接**</font>，HTTP1.1中默认开启Connection： keep-alive，一定程度上弥补了HTTP1.0每次请求都要创建连接的缺点


#### HTTP2.0和HTTP1.X相比的新特性

* <font color="green">**新的二进制格式（Binary Format）**</font>，HTTP1.x的解析是基于文本，基于文本协议的格式解析存在天然缺陷，文本的表现形式有多样性，要做到健壮性考虑的场景必然很多，二进制则不同，只认0和1的组合，基于这种考虑HTTP2.0的协议解析决定采用二进制格式，实现方便且健壮

* <font color="green">**header压缩**</font>，HTTP1.x的header带有大量信息，而且每次都要重复发送，HTTP2.0使用encoder来减少需要传输的header大小，通讯双方各自cache一份header fields表，既避免了重复header的传输，又减小了需要传输的大小

* <font color="green">**服务端推送（server push）**</font>，例如我的网页有一个sytle.css的请求，在客户端收到sytle.css数据的同时，服务端会将sytle.js的文件推送给客户端，当客户端再次尝试获取sytle.js时就可以直接从缓存中获取到，不用再发请求了

```js
// 通过在应用生成HTTP响应头信息中设置Link命令
Link: </styles.css>; rel=preload; as=style, </example.png>; rel=preload; as=image

```

* 多路复用（MultiPlexing）
```html
- HTTP/1.0  每次请求响应，建立一个TCP连接，用完关闭
- HTTP/1.1 「长连接」 若干个请求排队串行化单线程处理，后面的请求等待前面请求的返回才能获得执行机会，一旦有某请求超时等，后续请求只能被阻塞，毫无办法，也就是人们常说的线头阻塞；
- HTTP/2.0 「多路复用」多个请求可同时在一个连接上并行执行，某个请求任务耗时严重，不会影响到其它连接的正常执行；
```