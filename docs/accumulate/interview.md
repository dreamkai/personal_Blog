---
title:前端面试题
# sidebarDepth: 2
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
