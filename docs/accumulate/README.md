# 前端知识

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