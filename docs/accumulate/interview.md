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

#### 1.基于http的性能优化
* encodeURL/decodeURL 度整个URL编码,处理空格/中文
* encodeURLComponent/decodeURLComponent  主要对传递参数信息编码
* 强缓存一般都有谁本地有直接拿,不需要从服务器获取
* html一般不走强缓存