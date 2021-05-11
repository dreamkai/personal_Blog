# JavaScript
## ES6

### 1. symbol

#### 1.ES6中新加入的 **原始数据类型(基本数据类型/值类型)**，代表唯一值


* 对象的唯一属性：防止同名属性，及被改写或覆盖
* 消除魔术字符串：指代码中多次出现，强耦合的字符串或数值，应避免，而使用含义清晰的变量代替

```js
let m = Symbol(),
    n = Symbol();
console.log(m === n ) //false

let m = Symbol('A'),
    n = Symbol('A');
console.log(m === n ) //false
```
::: tip 提示
   魔术字符串是可以通过变量形式规避
:::

```js

function getMonth(month){
    if(month == 'Triangle'){
        return  true
    }else{
        return false
    }
}
 
getMonth('Triangle')

```
比如上文的`Triangle`就是魔术字符串,它多次出现与代码形成“强耦合”，当我们改带改代码的时候需要把所有出现该字段的地方修改一下,不利于将来的修改和维护


```js

const shapeType = {
  triangle: 'Triangle'
};
 
function getMonth(month){
    if(month == shapeType.triangle){
        return  true
    }else{
        return false
    }
}
 
getMonth(shapeType.triangle)

```

这样如果要修改这个字符串只用更改一个地方即可，方便快捷也不会导致程序出错。

如果仔细分析，可以发现shapeType.triangle等于哪个值并不重要，只要确保不会跟其他shapeType属性的值冲突即可。因此，这里就很适合改用 Symbol 值。
```js
const shapeType = {
  triangle: Symbol()
};
```
上面代码中，除了将`shapeType.triangle`的值设为一个 Symbol，其他地方都不用修改。


#### 2.在创建Symbol唯一值之后,取值必须注意

```js
let n = Symbol('N');
let obj = {
    name:'张三',
    age:18,
    [n]:100
}
//此时 
obj[Symbol('N')]  //undefined
```
::: warning 注意
此时,Symbol是新的唯一值,取不到
:::

```js

//此时 
obj[Symbol('N')]  = 200

// let obj = {
//     name:'张三',
//     age:18,
//     [Symbol('N')]:100,
//     [Symbol('N')]:200
// }
 
 obj[n]  //100
```
#### 3.Symbol的原型有constructor,是构造函数,但是内部不允许new

`Symbol() instance of Symbol //false`

#### 4.Symbol不能参加数学计算,不能参与隐式转换,但是可以显式转换

``` js
let n = Symbol()
 let p = n + 10

 console.log(p)  //报错

 Number(Symbol()) // 报错

 Symbol.toString()  // "Symbol()"

```

::: tip 提示
   Symbol可以显式转换成字符串,但是不能转换成数字
:::

#### 5.Symbol属性不参与 for…in/of 遍历,也不能被Object.Keys()遍历

* Object.getOwnPropertySymbols()可以单独拿到Symbol的值


``` js
Object.getOwnPropertySymbols().forEach((key) =>{
    console.log(obj[key])
})

```

#### 6.内置的Symbol值
ES6提供很多内置的Symbol值，指向语言内部使用的方法

* Symbol.hasInstance：对象的Symbol.hasInstance属性，指向一个内部方法，当其他对象使用instanceof运算符，判断是否为该对象的实例时，会调用这个方法

```js
class Person {}
let p1 = new Person;
console.log(p1 instanceof Person); //true
console.log(Person[Symbol.hasInstance](p1)); //true
console.log(Object[Symbol.hasInstance]({})); //true
```

* Symbol.isConcatSpreadable：值为布尔值，表示该对象用于Array.prototype.concat()时，是否可以展开
```js
let arr = [4, 5, 6];
console.log(arr[Symbol.isConcatSpreadable]); //undefined
let res = [1, 2, 3].concat(arr);
console.log(res); //[1,2,3,4,5,6]

arr[Symbol.isConcatSpreadable] = false;
res = [1, 2, 3].concat(arr);
console.log(res); //[1,2,3,[4,5,6]]
```
* Symbol.iterator：拥有此属性的对象被誉为可被迭代的对象，可以使用for…of循环
```js
// 让对象变为可迭代的值
let obj = {
    0: '珠峰培训',
    1: 11,
    length: 2,
    [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for (let item of obj) {
    console.log(item);
}

// 构造一个类数组
class ArrayLike {
    *[Symbol.iterator]() {
        let i = 0;
        while (this[i] !== undefined) {
            yield this[i];
            ++i;
        }
    }
}
let like1 = new ArrayLike;
like1[0] = 10;
like1[1] = 20;
for (let item of like1) {
    console.log(item);
}
```
* Symbol.toPrimitive: 该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值
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
                return ++this.value;
            case 'string': // 此时需要转换成字符串 例如:字符串拼接
                return String(this.value);
            case 'default': //此时可以转换成数值或字符串 例如：==比较
                return ++this.value;
        }
    }
};
if (a == 1 && a == 2 && a == 3) {
    console.log('OK');
}
```

* Symbol.toStringTag：在该对象上面调用Object.prototype.toString方法时，如果这个属性存在，它的返回值会出现在toString方法返回的字符串之中，表示对象的类型

```js
class Person {
    get [Symbol.toStringTag]() {
        return 'Person';
    }
}
let p1 = new Person;
console.log(Object.prototype.toString.call(p1)); //"[object Person]"
```


## 高级js

### 1.浏览器底层机制堆栈内存

1.  浏览器会在计算机内存中分配一块内存,专门用来供代码执行的=><font color="red">栈内存 ECStack</font>
2.  <font color="red">全局对象GO</font>,浏览器会把内置对象的属性方法放到一个单独的内存中,<font color="red">堆内存</font>,开辟的内存都是一个16进制的内存地址,方便后期找到这个内存
3.  <font color="red">EC(执行上下文)</font>:代码自己执行所在的环境
    - 全局的执行上下文EC(G)
    - 函数的执行上下文,函数代码独立的私有上下文中处理
    - 块级的执行上文
4. 形成的全局上下文,进入到栈内存中执行,执行完代码,可能会把形成的上下文出栈释放"出栈"
5. <font color="red">VO变量对象</font>:在当前上下文中,用来存放变量和值的地方(每个执行上下文都有自己的变量对象),函数私有上下文叫做<font color="red">AO活动对象</font>,但是也是变量对象
6. 基本类型的执行操作 var a = 12
   - 创建一个值
   - 创建一个变量
   - 让变量和值关联在一起
7. 对象类型的执行操作
   - 创建一个内存
   - 把键值对存储到堆内存中
   - 把内存地址放到栈中,供变量调用
8. 函数在堆内存存储的是字符串,函数在创建的时候就定义了函数的作用域,在全局创建,作用域就是全局
9. 函数内部形成一个全新的<font color="red">私有上下文EC(FN)</font>,供代码执行
10. 全局上下文(页面关闭销毁),压缩到栈的底部,把新的函数上下文进栈执行,放在栈的顶部
11. 执行前内部,函数自己上下文,函数的作用域,日后在私有上下文执行的时候,遇到一个遍历,首先看是否为自己的私有变量,是私有的,则操作自己的,不是沿着作用域链继续找
    - 初始化作用域链(scopeChain) <EC(FN),EC(G)>
    - 初始化this
    - 初始化实参集合(arguments)
    - 形参赋值
    - 变量提升
    - 代码执行


### 2.闭包

* 函数执行会形成全新的私有上下文,这个上下文可能被释放,也可能不被释放,不论是否释放,它的作用是:
  - 1.保护: 划分一个独立的代码执行区域,在这个区域中有自己私有变量存储的空间,而用到的私有变量和其他区域的变量不会有任何的冲突(防止全局变量污染)
  - 2.保存:如果上下文不被销毁,那么存储的私有变量的值也不会被销毁,可以被其下级上下文调取使用
* 我们把形成私有上下文产生白村和保护的机制,称之为闭包 => 它是一种机制


### 3.parseInt原理
* parseInt(string,radix)将一个字符串string 转为radix(2-36)进制的整数,把string看做radix进制,最后转成10进制
* radix不在2-36,最后都默认为NaN

```js
  parseInt('2AF5',16) 
  //5*1 + 15*16 + 10*16*16 + 2*16*16*16 = 10997

```