---
title: js高级程序设计
sidebarDepth: 2
---

## 一. js基本概念

###  1. js组成


* ECMAScript
* 文档对象模型(DOM)
* 浏览器对象模型(BOM)

### 2. 关于script标签

* script按代码顺序执行,通过放到body末尾
* defer属性把文档渲染完再执行
* async 异步加载script资源,不阻塞文档
* noscript 用于不支持JavaScript的显示内容


## 二. 语言基础

### 1.语法概念

* 区别大小写
* 注释
* 严格模式
* 语句
* 关键字和保留字

::: tip 提示
   关键字指的是var let const if 等
   保留字指的是 public let 等,用于将来作为关键字用
:::


### 2. 变量

* ECMAScript变量是松散类型,可以保留任何数据类型
* var可以局部定义,可以全局使用,var的<font color="red">**变量提升**</font>
* var 声明变量时，由于声明会被提升，JavaScript 引擎会自动将多余的声明在作用域顶部合
并为一个声明,let 的作用域是块，所以不可能检查前面是否已经使用 let 声明过同名变量，同
时也就不可能在没有声明的情况下声明它
* let声明的是<font color="red">**块作用域**</font>,var声明的是<font color="red">**函数作用域**</font>
* let声明的不能重复声明,不能变量提升,声明之前执行变量<font color="red">**暂时性死区**</font>
* let声明全局作用域不会成为window对象属性
* const声明的变量同时必须初始化变量,且<font color="red">**不可修改**</font>
*  修改const声明对象属性不违反限制,const声明只适合变量引用
* 使用时候const > let ,尽量不使用var

### 3. 数据类型

* 6种简单数据类型 <font color="red">**Underfined Null Boolean Number String Symbol**</font> 一种复杂数据类型是<font color="red">**Object**</font>

::: tip 提示
  Symbol 在博客中ES6模块有单独的详细介绍
:::

* typeof 说白了只是一个<font color="red">**三元运算符**</font> 
* typeof 调用null 返回 'object' 被认为是空对象引用

::: tip 提示 
 :relieved: 严格来讲，函数在 ECMAScript 中被认为是对象，并不代表一种数据类型。可是，
函数也有自己特殊的属性。为此，就有必要通过 typeof 操作符来区分函数和其他对象。
:::

* underfined 的使用意义在于区别空对象指针null和未初始化变量区别
* null是空对象指针

|   数据类型   |   数据类型 转换为 true 的值    |     转换为 false 的值    |       
|:-------:|:-------:|:-------:|
|  Boolean   | true   |  false   |
| String |非空字符串|""空字符串|
| Number |非零数值|0,NAN|
| Object |任意对象|null|
| Underfined |N/A(不存在)|underfined|

* Number(null) 返回0,Number(true)返回1,Number(false)0,Number(underfined)返回NaN


### 4.语句
1. do-while 语句是一种后测试循环语句,至少执行一次
2. while 先循环语句
3. for-in是一种严格迭代语句,用来枚举对象<font color="red">**非符号键值**</font> 
4. for-of 用于遍历可迭代对象的元素

 ::: warning 注意
   for in 循环不能保证返回顺序,不能处理underfined null
 :::

 for ... in循环由于历史遗留问题，它遍历的实际上是对象的属性名称。一个Array数组实际上也是一个对象，它的每个元素的索引被视为一个属性。

当我们手动给Array对象添加了额外的属性后，for ... in循环将带来意想不到的意外效果

```js
var a = ['A', 'B', 'C'];
a.name = 'Hello';
for (var x in a) {
    console.log(x); // '0', '1', '2', 'name'
}
```

for ... in循环将把name包括在内，但Array的length属性却不包括在内。

for ... of循环则完全修复了这些问题，它只循环集合本身的元素

```js
var a = ['A', 'B', 'C'];
a.name = 'Hello';
for (var x of a) {
    console.log(x); // 'A', 'B', 'C'
}
```

## 三. 变量,作用域与内存
### 1. 变量
* javaScript是松散类型,可以生命周期内改变
* 原始值值的是可以通过变量访问的直接值,对象不允许直接操作空间,我们操作对象是对该对象的引用,而非对象本身
* 动态属性:引用类型可以随意添加删除修改属性值,原始值不能直接赋值属性,也没有属性,但是赋值不会报错

```js
let name = "Nicholas"; 
name.age = 27; 
console.log(name.age); // undefined
```

::: warning 注意
   原始类型的初始化可以只使用原始字面量形式。如果使用的是 new 关键字，则 JavaScript 会创建一个 Object 类型的实例，但其行为类似原始值。
 :::

 ```js

 let name1 = "Nicholas"; 
let name2 = new String("Matt"); 
name1.age = 27; 
name2.age = 26; 
console.log(name1.age); // undefined 
console.log(name2.age); // 26 
console.log(typeof name1); // string 
console.log(typeof name2); // object

 ```

 * 复制值: 原始值复制会复制到新的变量位置,引用类型复制的是对象的指针,最后指向的还是一个对象


 * <font color="red">**传递值**</font>:ECMAScript 中所有函数的参数都是<font color="red">**按值传递**</font>的,在按值传递参数时，值会被复制到一个局部变量（即一个命名参数，或者用 ECMAScript 的话说，
就是 arguments 对象中的一个槽位）。在按引用传递参数时，值在内存中的位置会被保存在一个局部变
量，这意味着对本地变量的修改会反映到函数外部。

```js
function addTen(num) { 
 num += 10; 
 return num; 
} 
let count = 20; 
let result = addTen(count); 
console.log(count); // 20，没有变化
console.log(result); // 30
```

这里，函数 addTen()有一个参数 num，它其实是一个局部变量。在调用时，变量 count 作为参数
传入。count 的值是 20，这个值被复制到参数 num 以便在 addTen()内部使用。在函数内部，参数 num
的值被加上了 10，但这不会影响函数外部的原始变量 count。参数 num 和变量 count 互不干扰，它们
只不过碰巧保存了一样的值。如果 num 是按引用传递的，那么 count 的值也会被修改为 30。这个事实
在使用数值这样的原始值时是非常明显的。


我们创建了一个对象并把它保存在变量 person 中。然后，这个对象被传给 setName()
方法，并被复制到参数 obj 中。在函数内部，obj 和 person 都指向同一个对象。结果就是，即使对象
是按值传进函数的，obj 也会通过引用访问对象。当函数内部给 obj 设置了 name 属性时，函数外部的
对象也会反映这个变化，因为 obj 指向的对象保存在全局作用域的堆内存上。

```js
function setName(obj) { 
 obj.name = "Nicholas"; 
obj = new Object(); 
obj.name = "Greg"; 
} 
let person = new Object(); 
setName(person); 
console.log(person.name); // "Nicholas"
```

这个例子前后唯一的变化就是 setName()中多了两行代码，将 obj 重新定义为一个有着不同 name
的新对象。当 person 传入 setName()时，其 name 属性被设置为"Nicholas"。然后变量 obj 被设置
为一个新对象且 name 属性被设置为"Greg"。如果 person 是按引用传递的，那么 person 应该自动将
指针改为指向 name 为"Greg"的对象。可是，当我们再次访问 person.name 时，它的值是"Nicholas"，
这表明函数中参数的值改变之后，原始的引用仍然没变。当 obj 在函数内部被重写时，它变成了一个指
向本地对象的指针。而那个本地对象在函数执行结束时就被销毁了



* <font color="red">**typeof可以检测原始值,不能检测引用值**</font>,但是typeof 检测函数返回function
 
* <font color="red">**instance of可以检测复杂数据类型(引用类型)**</font>

```js
console.log(person instanceof Object); // 变量 person 是 Object 吗？  true
console.log(colors instanceof Array); // 变量 colors 是 Array 吗？   true
console.log(pattern instanceof RegExp); // 变量 pattern 是 RegExp 吗？  true
 
```

### 2.执行上下文

* 概念: 变量或函数的上下文决定了它们可以访问哪些数据，以及它们的行为
* 执行上下文主要有<font color="red">**全局上下文**</font>全局上下文和<font color="red">**函数上下文**</font>和块级上下文三种
* 上下文在其所有代码都执行完毕后会被销毁，包括定义在它上面的所有变量和函数
*  全局上下文在应用程序退出前才会被销毁，比如关闭网页或退出浏览器
* 上下文中的代码在执行的时候，会创建变量对象的一个<font color="red">**作用域链**</font>。这个作用域链决定了各级上下文中的代码在访问变量和函数时的顺序。
* 全局上下文的变量对象始终是作用域链的最后一个变量对象。
* 使用try catch可以增强作用域链

::: tip 提示 
 :relieved: const 声明暗示变量的值是单一类型且不可修改，JavaScript 运行时编译器可以将其所有实例都替换成实际的值，而不会通过查询表进行变量查找,尽量多使用const
:::

* 标识符查找: 当在特定上下文中为读取或写入而引用一个标识符时，必须通过搜索确定这个标识符表示什么。搜索开始于作用域链前端，以给定的名称搜索对应的标识符。


``` js
var color = 'blue'; 
function getColor() { 
let color = 'red'; 
{ 
let color = 'green'; 
return color; 
} 
} 
console.log(getColor()); // 'green'
```
getColor()内部声明了一个名为 color 的局部变量。在调用这个函数时，
变量会被声明。在执行到函数返回语句时，代码引用了变量 color。于是开始在局部上下文中搜索这个
标识符，结果找到了值为'green'的变量 color。因为变量已找到，搜索随即停止，所以就使用这个局
部变量。这意味着函数会返回'green'。在局部变量 color 声明之后的任何代码都无法访问全局变量
color，除非使用完全限定的写法 window.color。

::: warning 注意
   标识符查找并非没有代价。访问局部变量比访问全局变量要快，因为不用切换作用域。不过，JavaScript 引擎在优化标识符查找上做了很多工作，将来这个差异可能就微不足道了。
 :::

 ###  3. js垃圾回收机制

 * 标记清理法: 回收时会标记内存中存储的所有变量。然后，它会将所有在上下文中的变量，以及被在上下文中的变量引用的变量的标记去掉。
* 引用计数法: 通过使用加+1,覆盖减1,为0则会删除

## 四. 基本引用类型

### 1. 基本内容

* 引用值（或者对象）是某个特定引用类型的实例。在 ECMAScript 中，引用类型是把数据和功能组织到一起的结构

*  Date :  toDateString()显示日期中的周几、月、日、年（格式特定于实现）；
   toTimeString()显示日期中的时、分、秒和时区（格式特定于实现）；
   toLocaleDateString()显示日期中的周几、月、日、年（格式特定于实现和地区）；
   toLocaleTimeString()显示日期中的时、分、秒（格式特定于实现和地区）；
   toUTCString()显示完整的 UTC 日期（格式特定于实现）。

* RegExp正则

### 2.基本包装类型

*  <font color="red">**Boolean、Number 和 String**</font>
* 包装类型的内部实现:原始值是不能直接点属性,只有引用类型可以,为了方便操作原始值,提供了常规的包装类型

1. 创建一个 String 类型的实例；
2. 调用实例上的特定方法；
3. 销毁实例。

```js
let s1 = new String("some text"); 
let s2 = s1.substring(2); 
s1 = null;
```

::: tip 提示
 :heart:  引用类型与原始值<font color="red">**包装类型**</font>的主要区别在于对象的生命周期。在通过 new 实例化引用类型后，得到
的实例会在离开作用域时被销毁，而自动创建的原始值包装对象则只存在于访问它的那行代码执行期
间。这意味着<font color="red">**不能在运行时给原始值添加属性和方法**</font>
:::

``` js
//搞清转型函数和构造的区别
let value = "25"; 
let number = Number(value); // 转型函数
console.log(typeof number); // "number" 
let obj = new Number(value); // 构造函数
console.log(typeof obj); // "object"
```


#### <font color="red">**Number 提供的方法**</font>
  1. <font color="red">**toFixed()**</font>方法返回包含指定小数点位数的数值字符串
  
  ``` js
  let num = 10; 
  console.log(num.toFixed(2)); // "10.00"    
  ```

  ::: warning 注意 
  :cactus: 数值本身的小数位超过了参数指定的位数，则四舍五入到最接近的小数位
  :::

  ``` js
  let num = 10.005; 
  console.log(num.toFixed(2)); // "10.01"
  ```
  2. <font color="red">**valueOf()**</font>方法返回 Number 对象表示的原始数值
  3. <font color="red">**toLocaleString()和 toString()**</font>返回字符串,toString()方法可选地接收一个表示基数的数，并返回相应基数形式的数值字符串

  ```js
  let num = 10; 
  console.log(num.toString()); // "10" 
  console.log(num.toString(2)); // "1010" 
  console.log(num.toString(8)); // "12" 
  console.log(num.toString(10)); // "10" 
  console.log(num.toString(16)); // "a"

  ```

  4. toExponential()，返回以科学记数法（也称为指数记数法）表示的数值字符串。与 toFixed()一样，toExponential()也接收一个参数，表示结果中小数的位数。

  5. ES6:<font color="red">**isInteger()**</font>方法，用于辨别一个数值是否保存为整数。

  ```js
   console.log(Number.isInteger(1)); // true 
   console.log(Number.isInteger(1.00)); // true 
   console.log(Number.isInteger(1.01)); // false
  ```

####  <font color="red">**String 提供的方法**</font>
 1. valueOf()、toLocaleString()和 toString()都返回对象的原始字符串值。每个 String 对象都有一个 length 属性，表示字符串中字符的数量。
 2.  <font color="red">**charAt()**</font>方法返回给定索引位置的字符，由传给方法的整数参数指定。

 ``` js
 let message = "abcde"; 
 console.log(message.charAt(2)); // "c"
 ```

 3.  使用 charCodeAt()方法可以查看指定码元的字符编码。这个方法返回指定索引位置的码元值，索引以整数指定

 ``` js
 let message = "abcde"; 
 // Unicode "Latin small letter C"的编码是 U+0063 
  console.log(message.charCodeAt(2)); // 99
 ```

 4. codePointAt()接收 16 位码元的索引并返回该索引位置上的码点

 *  <font color="red">**字符串截取方法**</font>
 1. <font color="red">**concat()**</font> 
 2. <font color="red">**slice()、substr()和 substring()**</font> 

 slice(),substring() 第一个参数表示子字符串开始的位置，第二个参数表示子字符串结束的位置。
 substr() 第二个参数表示截取个数

 ::: warning 注意
  :blush: slice(),substring(),substr() 不会修改调用它们的字符串，而只会返回提取到的原始新字符串值
 :::

 3.  slice()方法将所有负值参数都当成字符串长度加上负参数值。
 4.  substr()方法将第一个负参数值当成字符串长度加上该值，将第二个负参数值转换为 0。
 5.  substring()方法会将所有负参数值都转换为 0。

 ``` js
 let stringValue = "hello world"; 
  console.log(stringValue.slice(3)); // "lo world" 
  console.log(stringValue.substring(3)); // "lo world" 
  console.log(stringValue.substr(3)); // "lo world" 
  console.log(stringValue.slice(3, 7)); // "lo w" 
  console.log(stringValue.substring(3,7)); // "lo w" 
  console.log(stringValue.substr(3, 7)); // "lo worl"
 ```

 *  <font color="red">**字符串位置方法**</font>
 1. <font color="red">**indexOf()**</font>用于在字符串中定位子字符串
 2. <font color="red">**lastIndexOf()**</font>用于在字符串中定位子字符串

 ::: warning 注意
 这两个方法从字符串中搜索传入的字符串，并返回位置（如果没找到，则返回-1）,indexOf()方法从字符串开头开始查找子字符串，而 lastIndexOf()方法从字符串末尾开始查找子字符串。
 :::

*  <font color="red">**字符串其他方法**</font>

1. <font color="red">**startsWith()**</font>:从字符串中搜索传入的字符串，并返回一个表示是否包含的布尔值,检查开始于索引 0 的匹配项
2. <font color="red">**endsWith()**</font>: 从字符串中搜索传入的字符串，并返回一个表示是否包含的布尔值,检查开始于索引 (string.length - substring.    length)的匹配项
3.  <font color="red">**includes()**</font>: 从字符串中搜索传入的字符串,检查整个字符串

startsWith()和 includes()方法接收可选的第二个参数，表示开始搜索的位置。如果传入第二个参数，则意味着这两个方法会从指定位置向着字符串末尾搜索，忽略该位置之前的所有字符。

``` js
let message = "foobarbaz"; 
console.log(message.startsWith("foo")); // true 
console.log(message.startsWith("foo", 1)); // false 
console.log(message.includes("bar")); // true 
console.log(message.includes("bar", 4)); // false

```
endsWith()方法接收可选的第二个参数，表示应该当作字符串末尾的位置。如果不提供这个参数，那么默认就是字符串长度。如果提供这个参数，那么就好像字符串只有那么多字符一样：
```js

let message = "foobarbaz"; 
console.log(message.endsWith("bar")); // false 
console.log(message.endsWith("bar", 6)); // true 

```
4. <font color="red">**trim()**</font>
5.  <font color="red">**repeat()**</font>:字符串复制多少次
6. <font color="red">**padStart()和 padEnd()方法**</font>:padStart()和 padEnd()方法会复制字符串，如果小于指定长度，则在相应一边填充字符，直至满足长度条件。这两个方法的第一个参数是长度，第二个参数是可选的填充字符串，默认为空格
```js
let stringValue = "foo"; 
console.log(stringValue.padStart(6)); // " foo" 
console.log(stringValue.padStart(9, ".")); // "......foo" 
console.log(stringValue.padEnd(6)); // "foo " 
console.log(stringValue.padEnd(9, ".")); // "foo......"
```

可选的第二个参数并不限于一个字符。如果提供了多个字符的字符串，则会将其拼接并截断以匹配
指定长度。此外，如果长度小于或等于字符串长度，则会返回原始字符串。
``` js
 let stringValue = "foo"; 
  console.log(stringValue.padStart(8, "bar")); // "barbafoo" 
  console.log(stringValue.padStart(2)); // "foo" 
 console.log(stringValue.padEnd(8, "bar")); // "foobarba" 
  console.log(stringValue.padEnd(2)); // "foo"
```
6.  字符串迭代与解构
字符串的原型上暴露了一个@@iterator 方法，表示可以迭代字符串的每个字符,字符串就可以通过解构操作符来解构了。

7.  字符串大小写转换: toLowerCase()、toLocaleLowerCase()、toUpperCase()和toLocaleUpperCase()

8. 字符串匹配是 match()方法

### 3.单例内置对象
1. <font color="red">**Global对象属性**</font>
* Global 对象在全局作用域中定义的变量和函数都会变成 Global 对象的属性。
* eval()。这是一个完整的 ECMAScript 解释器


```js
let msg = "hello world"; 
eval("console.log(msg)"); // "hello world"
```

::: warning 注意
注意 解释代码字符串的能力是非常强大的，但也非常危险。在使用 eval()的时候必须极为慎重，特别是在解释用户输入的内容时。因为这个方会对 XSS 利用暴露出很大的攻击面。恶意用户可能插入会导致你网站或应用崩溃的代码。
:::

* window对象:浏览器将 window 对象实现为 Global对象的代理。因此，所有全局作用域中声明的变量和函数都变成了 window 的属性。

2.  <font color="red">**Math对象属性**</font>

|   属性   |   说明  | 
|:-------:|:-------:|
| Math.E | 自然对数的基数 e 的值 |
| Math.LN10 | 10 为底的自然对数
| Math.LN2 | 2 为底的自然对数
| Math.LOG2E | 以 2 为底 e 的对数
| Math.LOG10E | 以 10 为底 e 的对数
| Math.PI | π 的值
| Math.SQRT1_2 | 1/2 的平方根
| Math.SQRT2 |2的平方根
| Math.max | 求最大值 |
| Math.min | 求最小值 |
|  Math.random | 获取0-1的随机数|

## 五. 集合引用类型

### 1. Object对象
* 大多数引用值的示例使用的是 Object 类型。
* 属性一般是通过点语法来存取的，但也可以使用中括号来存取属性,一般是变量或者属性名中是可以包含非字母数字字符的
* 对象字面量表示法

```js
let person = { 
 name: "Nicholas", 
 age: 29 
};

```

### 2.Array对象

* 创建数组
1.  使用Array构造函数 let colors = new Array();
2. 字面量形式: let colors = ["red", "blue", "green"];

::: warning 注意
与对象一样，在使用数组字面量表示法创建数组不会调用 Array 构造函数。
:::
* 数组空位:ES6 新增方法普遍将这些空位当成存在的元素，只不过值为 undefined：

* 检测数组
1. 使用 instanceof 操作符
2. isArray()方法: 这个方法的目的就是确定一个值是否为数组，而不用管它是在哪个全局执行上下文中创建的

|   方法   |   说明  | 
|:-------:|:-------:|
|迭代器方法|
| keys() | 返回数组索引的迭代器 |
| values() | 返回数组元素的迭代器 |
| entries() | 返回索引/值对的迭代器 |
| 复制和填充方法|
| fill() | 可以向一个已有的数组中插入全部或部分相同的值|
| copyWithin() | 按照指定范围浅复制数组中的部分内容
| 转换方法 |
| valueOf()|返回数组本身|
| toString()| 返回由数组中每个值的等效字符串拼接而成的一个逗号分隔的字符串 |
| toLocaleString()| - |
|  栈方法( 先进后出,后进先出)|
| push()| 数组末尾推入 |
| pop()| 数组开头推入|
| 队列方法 (先进先出)|
|  unshift()| 末尾删除|
| shift()|开头删除 |
|排序方法|
| reverse() | 数组反转|
| sort() | 排序 | 

* sort()会按照这些数值的字符串形式重新排序
``` js
let values = [0, 1, 5, 10, 15]; 
values.sort(); 
alert(values); // 0,1,10,15,5
```
所以需要接受一个比较函数

``` js
function compare(value1, value2) { 
 if (value1 < value2) { 
 return -1; 
 } else if (value1 > value2) { 
 return 1; 
 } else { 
 return 0; 
 } 
}
```

::: warning 注意
reverse()和 sort()都返回调用它们的数组的引用。
:::

|   方法   |   说明  | 
|:-------:|:-------:|
|  操作方法 |
| concat()| 以在现有数组全部元素基础上创建一个新数组  | 
|  slice(开始索引,结束索引(不包含结束))| 用于创建一个包含原有数组中一个或多个元素的新数组,负值等于数组长度加负数  |
| splice( 开始位置、要删除的元素数量,要插入的元素) | 实现数组删除,插入,替换 | 
| 搜索和位置方法 |
| indexOf() |  返回要查找的元素在数组中的位置，如果没找到则返回 -1 |
| lastIndexOf() | 同上,查找顺序从末尾开始 | 
| includes() |  返回布尔值，表示是否至少找到一个与指定元素匹配的项 | 
| 搜索和位置方法(断言函数) |
| find(元素、索引,数组本身) | 返回第一个匹配的元素,接收第二个可选的参数，用于指定断言函数内部 this 的值 (箭头函数无效) |
| findIndex(元素、索引,数组本身) | 返回第一个匹配元素的索引,接收第二个可选的参数，用于指定断言函数内部 this 的值 (箭头函数无效)  |
| 迭代方法 |
| every() | 对每一项函数都返回 true，则这个方法返回 true。|
| filter()| 过滤符合条件的数值,返回 true 的项会组成数组之后返回 |
|forEach() |  对数组每一项都运行传入的函数，没有返回值|
| map()|  对数组批量操作|
| some() | 有一项符合条件就返回true|

* Symbol.isConcatSpreadable 可以确定是不是要打平数组
``` js
let colors = ["red", "green", "blue"]; 
let newColors = ["black", "brown"]; 
let moreNewColors = { 
 [Symbol.isConcatSpreadable]: true, 
 length: 2, 
 0: "pink", 
 1: "cyan" 
}; 
newColors[Symbol.isConcatSpreadable] = false; 
// 强制不打平数组
let colors2 = colors.concat("yellow", newColors); 
// 强制打平类数组对象
let colors3 = colors.concat(moreNewColors); 
console.log(colors); // ["red", "green", "blue"] 
console.log(colors2); // ["red", "green", "blue", "yellow", ["black", "brown"]] 
console.log(colors3); // ["red", "green", "blue", "pink", "cyan"]

```
* map方法开发中的用法
```js
 this.transformData = res.lineChar.map(item => {
    return { time: parseTime(item.time, '{m}/{d}'), ROI: item.count }
  })
```

|   方法   |   说明  | 
|:-------:|:-------:|
|  归并方法 |
| reduce() | 会迭代数组的所有项 |
| reduceRight()| 会迭代数组的所有项,从最后开始|

``` js
let values = [1, 2, 3, 4, 5]; 
let sum = values.reduce((prev, cur, index, array) => prev + cur); 
alert(sum); // 15
```

### 3. Map

* Map 是一种新的集合类型，为这门语言带来了真正的键/值存储机制。
* 基本Api

``` js
const m1 = new Map([ 
 ["key1", "val1"], 
 ["key2", "val2"], 
 ["key3", "val3"] 
]); 
alert(m1.size); // 3

// 使用自定义迭代器初始化映射
const m2 = new Map({ 
 [Symbol.iterator]: function*() { 
 yield ["key1", "val1"]; 
 yield ["key2", "val2"]; 
 yield ["key3", "val3"]; 
 } 
}); 
alert(m2.size); // 3
```

* 可以使用 set()方法再添加键/值对。另外，可以使用 get()和 has()进行查询，可以通过 size 属性获取映射中的键/值对的数量，还可以使用 delete()和 clear()删除值。

* 映射实例可以提供一个迭代器（Iterator），能以插入顺序生成[key, value]形式的数组。可以通过 entries()方法（或者 Symbol.iterator 属性，它引用 entries()）取得这个迭代器：

``` js
const m = new Map([ 
 ["key1", "val1"], 
 ["key2", "val2"], 
 ["key3", "val3"] 
]); 
alert(m.entries === m[Symbol.iterator]); // true 
for (let pair of m.entries()) { 
 alert(pair); 
} 
// [key1,val1] 
// [key2,val2] 
// [key3,val3] 
for (let pair of m[Symbol.iterator]()) { 
 alert(pair); 
} 
// [key1,val1] 
// [key2,val2] 
// [key3,val3]
```