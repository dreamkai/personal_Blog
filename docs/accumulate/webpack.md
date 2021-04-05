---
title: webpack&&脚手架相关分享
sidebarDepth: 2
---

## 使用require.context实现前端工程自动化


### 1. 介绍
一个webpack的api,通过执行require.context函数获取一个特定的上下文,主要用来实现自动化导入模块,在前端工程中,如果遇到从一个文件夹引入很多模块的情况,可以使用这个api,它会遍历文件夹中的指定文件,然后自动导入,使得不需要每次显式的调用import导入模块

### 2. 使用场景
日常情况下,我们使用最多的则是在vuex大型项目的module管理上面
```js
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)


const modulesFiles = require.context('./modules', true, /\.js$/)

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters
})

export default store

```

让我们对比一下,正常情况下,我们不用工程化该怎么做

``` js
import Vue from 'vue'
import Vuex from 'vuex'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import user from './modules/user'
import app from './modules/app'
import tagsView from './modules/tagsView'
import activity from './modules/activity'
import cms from './modules/cms'
import dataCenter from './modules/dataCenter'
import enter from './modules/enter'
import productCenter from './modules/productCenter'
import role from './modules/role'
import onlineShopInventory from './modules/onlineShopInventory'
import notice from './modules/notice'

import rfm from './modules/rfmShop'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    user,
    tagsView,
    activity,
    cms,
    dataCenter,
    enter,
    productCenter,
    role,
    onlineShopInventory,
    notice
  },
  getters
})

export default store
```

是不是感觉又臭又长,我们每次都需要手动引入,一旦后期更改文件之后,还会出现报错的问题

### 3. 分析require.context

1. directory {String} -读取文件的路径
2. useSubdirectories {Boolean} -是否遍历文件的子目录  
3. regExp {RegExp} -匹配文件的正则

**语法: require.context(directory, useSubdirectories = false, regExp = /^.//);**

::: tip 提示 
   :smiley: 当然我们不仅在vuex和router等项目中使用前端工程化,图片的引入也同样受用
:::

### 4. 图片引入
常规情况下,我们项目文件html的图片标签引入文件会是这样的:

``` html
  <img src="../assets/logo.png">
```
但是这种带来的问题就是后期我们在更换图片文件夹和图片位置的时候,也需要手动修改,这就显得很low了:thumbsdown:

于是我们可以在webpack配置,默认用@访问src文件下的文件,这样我们只要保证我们访问的图片在src下就可以了

``` html
  <img src="@/assets/logo.png">
```
但是问题又来了,我新建的图片文件夹在src下,不在原目录下,我是不是又需要更改一下呢,而且失去了智能提醒,还需要手动写路径,无疑让我们很不爽
于是我们利用了模块化的思想解决了这个问题,利用require导入

``` js
export default{
   bg_top:require('@/assets/topshow.png'), 
   pro_msg:require('@/assets/product_msg.png'),
   pro_msg:require('@/assets/product_msg.png'),
   pro_black:require('@/assets/black.png'),
   pro_full:require('@/assets/full.png'),
   pro_progress:require('@/assets/progress.png'),
   pro_source:require('@/assets/product_source.png'),
   pro_1:require('@/assets/img_1.png'),
   pro_2:require('@/assets/img_2.png'),
   pro_3:require('@/assets/img_3.png'),
   pro_4:require('@/assets/img_4.png'),
   pro_5:require('@/assets/img_5.png'),
   pro_report:require('@/assets/report.png'),
   pro_last:require('@/assets/last.png'),
   pro_step:require('@/assets/step.png')
}
```
挂载到vue中
``` js
import Source from '@/utils/source'
Vue.prototype.$source = Source
```

页面使用
``` html
 <img :src="$source.bg_top" alt="">
```

此刻我只想说一句,又更有逼格了,不对等等,我感觉也没有好用到哪去啊,还让我们多写了代码,也没有解决问题,不符合程序员的气质:dizzy_face:

**于是前端工程化完美的解决了这个问题**

```js
const source = {}
let requireContext = require.context('../assets/.', true,  /\.(?:jpg|gif|png)$/)
console.log(requireContext)
// requireContext.keys() 返回匹配成功模块的名字组成的数组
requireContext.keys().forEach((key) => {
  // 通过 requireContext(key)导出文件内容
  const mod = requireContext(key)
  source[key.match(/(?<=.\/).*?(?=.jpg|.gif|.png)/)] = mod.__esModule && mod.default ? mod.default : mod
})
export default{
  ...source
 }
```

此时在控制台

![](/images/webpack.png)

全局可以直接使用,而且我们后期如果需要更改文件夹,只需要统一配置就行,也不用担心文件路径,用起来方便很多

``` html
 <img :src="$source.logo" alt="">
```
::: warning 注意
:disappointed: 日常正则匹配一定要处理好,否则全局图片崩盘,到时候就爽歪歪咯
:::


## webpack 学习

### 1.安装
初始化:npm init

```js
 npm install webpack webpack-cli -D
```

### 2.指定打包入口和出口
#### 2.1 同级下创建webpack.config.js

* <font color="red">entry</font>:指定打包文件的入口
* <font color="red">output</font>:指定打包生成文件的出口

```js
 const { resolve } = require('path');
 const path = require('path');

  module.exports = {
      mode:'development' //可以实现打包代码不压缩
      entry:'./src/index.js',
      output:{
          path:resolve(__dirname,'dist'),//输出文件夹的绝对路径
      },
}
```

#### 2.2 path,publicPath,contentBase区别

|   类别   |   配置名称  |  描述
|:-------: |:-------:  |  :-------:| 
| output | path | 指定输出到硬盘中的目录|
| output| publicPath |  表示的是打包生成的index.html文件里面引入资源的前缀 |
| devServer | publicPath | 主要用于开发环境访 问的路径, 表示的是打包生成静态文件所在的位置(若是devServer里面的publicPath没有设置,则会认为是output里面设置的publicPath的值),要保证和output publicPath一样 | 
| devServer | contentBase | 用于配置提供额外静态文件内容的目录(不需要打包的内容,比如图片) | 



### 3.使用loader
* webpack只能理解js和json文件
* loader让webpack能处理其他类型的文件,并将他们转换成有效的模块,以供程序使用,以及被添加到依赖图中

```js
module:{
  rules:[
    {test:/.txt$/,use:'raw-loader}
  ]
}
```

### 4.使用插件plugin
#### 4.1 安装

```js
 npm install html-webpack-plugin  -D

```
#### 4.2 使用
```js
 const HtmlWebpackPlugin = require('html-webpack-plugin')

 plugins:[
   new HtmlWebpackPlugin({
     template:'./src/index.html'
   })
 ]

```

### 5.配置webpack-dev-server

#### 5.1 安装
```js
 npm install webpack-dev-server  -D
```

#### 5.2 使用
 * devServer会启动一个http服务器,把一个文件夹作为静态目录
 * 为了提高性能,使用的内存文件系统
  

```js
   devServer:{
      contentBase:resolve(__dirname,'dist'),//output优先级更高内容路径,可以不需要
      writeToDisk:true,//此选项可以生成一份打包文件写入硬盘里面
      port:8080,
      open:true,//自动打开浏览器
      compress:false,//是否开启自动压缩
      publicPath:'/'
    },
```

* publicPath可以不需要,默认是/
* contentBase正常不需要,会首先访问output


### 6. 支持css

#### 6.1 安装
```js
npm install css-loader style-loader  -D
```
#### 6.2 使用模块
* css-loader用于处理import等语法文件引入
* style-loader用于把style查到html,head的style里面

```js
module:{
  rules:[
    {rule:/\.css$/,use:['style-loader','css-loader']}
  ]
}

```
#### 6.3 支持sass和less


```js
npm install less less-loader node-sass sass-loader  -D
```
使用
 * less-loader用于处理把less转成css
```js
module:{
  rules:[
    {rule:/\.less$/,use:['style-loader','css-loader','less-loader]},
    {rule:/\.scss$/,use:['style-loader','css-loader','sass-loader]},
  ]
}

```

### 7.支持图片

* 在webpack中引入图片
  - 通过import或者require引入图片
  ```js
    const logo = require('./logo.png')
    const img = new Image()
    img.src = logo //esModule:true;那logo.default才能获取图片
    document.body.appendChild(img)
  ```
  - 通过静态文件目录,通过html引入,需要配置devServer.contentBase,不然只能读取打包后的文件了  resolve(__dirname,'static')
  - 在css通过url引入图片.css-loader进行解析处理

#### 7.1 安装
  ```js
  npm install file-loader url-loader html-loader -D
  ```

#### 7.2 使用

```js

module:{
  rules:[
    {rule:/\.(jpg|png|bmp)$/,use:[
      {
        loader:'file-loader',
        options:{
          name:'[hash:10].[ext]'//哈希取10位,保留拓展名
          esModule:false,//不需要包装成es6模块
          limit:32*1024 //如果图片小于limit,小于8k的话就会转成base64位内嵌到html中,否则行为和file-loader一样
        }
      }
   
  ]
}

```

::: tip 提示
 url-loader是对file-loader增强,多了一个选项limit<br>
 url-loader内部依赖file-loader,所以会帮你安装<br>
 判断图片是不是大于limit,如果大于的话就会把工作交给file-loader处理,否则,就转成base64自己处理
:::


```js
module:{
  rules:[
    {rule:/\.(jpg|png|bmp)$/,use:[
      {
        loader:'url-loader',
        option:{
          name:'[hash:10].[ext]'//哈希取10位,保留拓展名
          esModule:false,//不需要包装成es6模块
          limit:
          
        }
      }
   
  ]
}
```

### 8.支持js
* babel-loader使用Babel和webpack转义js文件
* <font color="blue">@babel/@babel/core</font>是Babel编译的核心包
* <font color="blue">@babel/@babel/present-env</font>为每一个环境的预设
* <font color="blue">@babel/plugin-proposal-decorators</font>把类和对象装饰器编译成ES5
* <font color="blue">@babel/plugin-proposal-class-properties</font>转换静态类属性以及使用属性初始值语法声明的属性

#### 8.1 使用

```js
 module:{
   rules:[
     {rule:/\.js$/,use:[
      {
        loader:'babel-loader',
        options:{
          presets:[
             "@babel/preset-env",//可以转换js语法,转成低级语法
          ]
        }
      }
     ]}
   ]
 }

```

#### 8.2 babel-loader,babel/core,babel/preset-env的关系

* babel-loader是一个函数
  - babel-loader的作用是调用babelCore
  - babelCore本身值提供一个过程管理功能,把源代码转换成抽象语法树,通过遍历和生成,它本身也不知道,具体要转换成什么语法,以及语法如何转换,这个只有babel/preset-env
  - 预设是plugin插件的集合,里面有很多插件

|   babel   |   说明  | 
|:-------:|:-------:|
| babel-loader | 负责调用babelCore |
| babel/core | 把源代码转换成抽象语法树,通过babel/preset-env处理完后,再用es5语法树重新生成es5语法
| babel/preset-env | 负责把es6转成es5语法树

```js
function loader(source){
  let es5 = babelCore.transform(source)
  return es5;
}
```

#### 8.3 装饰器的使用

```js
 module:{
   rules:[
     {rule:/\.js$/,use:[
      {
        loader:'babel-loader',
        options:{
          presets:[
             "@babel/preset-env",//可以转换js语法,转成低级语法
          ],
          plugins:[
            ["@babel/plugin-proposal-class-properties",{legacy:true}]
          ]
        }
      }
     ]}
   ]
 }

```

#### 8.4 babel/polyfill

* 用来解决低版本浏览器不能识别类似promise等语法

```js
 module:{
   rules:[
     {rule:/\.js$/,use:[
      {
        loader:'babel-loader',
        options:{
          presets:[
            [
              "@/babel/preset-env",{
                useBuiltIns:'usage',//按需加载polyfill
                corejs:{version:3},
               targets:[
                 chrome:'60',
                 filefox:'60',
                 ie:'9',
                 .
                 .
                 .
               ] 
              }
            ]
          ]
        }
      }
     ]}
   ]
 }

```
