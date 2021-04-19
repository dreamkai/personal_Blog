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
    {test:/\.css$/,use:['style-loader','css-loader']}
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
    {test:/\.less$/,use:['style-loader','css-loader','less-loader]},
    {test:/\.scss$/,use:['style-loader','css-loader','sass-loader]},
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
    {test:/\.(jpg|png|bmp)$/,use:[
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
    {test:/\.(jpg|png|bmp)$/,use:[
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
* <font color="blue">@babel/@babel/core</font>是Babel编译的核心包,还有核心API,比如transform,parse,babel/code本身生产语法树,遍历语法树,生成新代码,不负责转换语法树,
* <font color="blue">babel-types</font>负责构造,验证以及变换AST节点的方式,对编写AST逻辑有效
* <font color="blue">babel-template</font>可以将普通字符串转成AST,提供更便捷实用
* <font color="blue">babel-traverse</font>用于AST遍历,维护整棵树状态,负责替换,移除和添加节点
* <font color="blue">@babel/@babel/present-env</font>为每一个环境的预设,只能转换js语法
* <font color="blue">@babel/plugin-proposal-decorators</font>把类和对象装饰器编译成ES5
* <font color="blue">@babel/plugin-proposal-class-properties</font>转换静态类属性以及使用属性初始值语法声明的属性

#### 8.1 使用

```js
 module:{
   rules:[
     {test:/\.js$/,use:[
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
     {test:/\.js$/,use:[
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

#### 8.4 babel-polyfill和babel-runtime

#### 8.4.1  babel-polyfill
* Babel默认只能转换js语法,而不能转换新的API,比如Set,Map,Promise,Proxy等全局对象,还有全局对象方法比如Object.assign都不会转码
* babel-polyfill是通过全局对象和内置对象的prototype实现的,缺点是全局空间污染
* core-js  其实就是腻子包,可以补充缺失

@babel/@babel/preset-env未环境预设
* "useBuiltins:"false",不对polyfill做操作,如果引入@babel/polyfill,则全局引入
* "useBuiltins:"entry",根据配置浏览器兼容,此时需要手动引入 import "core-ks/stable" import "regenerator-runtime/runtime"
* "useBuiltins:"usage",实现按需加载,动态引入需要的语法


```js
 module:{
   rules:[
     {test:/\.js$/,use:[
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

#### 8.4.2  babel-runtime
* Babel为解决全局空间污染的问题,提供了单独的包babel-runtime用于编译模块的工具函数
* babel-runtime 更像是按需加载的表现
* 需要手动引入

```js
npm install babel-runtime -D
```


```js
 import Promise from "babel-runtime/core-js/promise"
 const p = new Promise(()=>{

 })


```
#### 8.4.3  babel-plugin-transform-runtime
* 启用插件后,Babel就会使用babel-runtime函数
* 插件能自动转换成require语法,指向为babel-runtime的应用
* babel-plugin-transform-plugin 在使用api自动引入import babel-runtime里面polyfill
  - 当我们使用async/await ,自动引入babel/runtime/regenerator
  - 当我们使用ES6静态事件或者内置对象,自动引入babel-runtim/core-js
  - 移除内里看babel helpers替换使用babel-runtime/helpers

安装

```js
 npm install @babel/runtime-corejs2 -D

```

使用

```js
module:{
  rules:[
    {
      test:/\.js$/,use:[
        {
          loader:'babel-loader',
          options:{
            presets:[
              [
                "@babel/preset-env",{
                  useBuiltIns:"usage",
                  corejs:{version:3},
                }
              ]
            ],
            plugins:[
             ["babel-plugin-transform-runtime',{
               corejs:3,
               helpers:true, //是否提取类的模块继承方法
               regenerator:true
             }]
            ]   
          }
        }
      ]
    }
  ]
}

::: tip 提示

babel-runtime更适合在类库和组件使用,而babel-polyfill适合业务项目使用


:::



```

### 9. ESlint代码校验

#### 9.1 安装
```js
 npm install eslint eslint-loader babel-eslint -D

```

#### 9.2 使用

```js
 module:{
   rules:[
     {
       test:/\.js$/,
       use:'eslint-loader',
       enforce:'pre', //强制执行顺序
       options:{fix:true}//强制修复
       exclude:/node_module/ //不需要检查
       include:resolve(__dirname,'src) //包含
      }
   ]
 }
```


#### 9.3 使用插件airbnb增加校验配置

新建文件.eslint.js

```js
module.exports = {
  parser:"babel-eslint",//解析器帮助我们把源代码转成抽象语法树
  extends:'airbnb',
  parserOption:{
    sourceType:"module",
    ecmaVersion:2015
  }
  env:{
    browser:true
  },
  rules:{
    ;;;
  }
  ]
}

```


### 10. sourcemap代码调试

* sourcemap是为了解决开发代码与实际代码不一致帮助我们debug到原始代码的技术
* webpack 通过配置可以给我们自动生成source maps文件,map 文件是一种对应编译文件和源文件的方法


|   类型   |   含义  | 
|:-------:|:-------:|
| source-map | 原始代码 最好的sourcemap质量,有完整的结果,单独在外部生成完整的sourcemap文件,并且在目标文件简历关联,能提示错误代码和定位准确位置,构建慢 |
|inline-source-map| 以base64格式内联在打包文件中,内敛构建速度更快,也能提示错误代码和准确位置 |
| eval-source-map | 每个某块单独生产一个单独的soucemap文件内联,并且使用eval执行,方便缓存,编译更快,重构构建快 |
| cheap-module-eval-source-map| 原始代码(只有行内)同样道理,但是最高的质量和最低的性能 | 
| cheap-eval-source-map| 转换代码(行内)每个模块被eval执行,并且sourcemap作为eval的一个default | 
| eval| 生成代码,每个模块都被eval执行,并且存下@sourceURL,带eval 模式构建模式能cache SourceMap | 
| cheap-source-map| 转换代码(行内)生成的sourcemap没有列映射,从loaders生产的sourcemap没有被使用 | 
| cheap-module-source-map| 原始代码(只有行内),与上面一样除了每行特点的从loader进行映射 | 

只是下面五个关键词的组合

|  关键词  |   含义  | 
|:-------:|:-------:|
| eval|使用eval包裹模块代码,转成字符串,编译更快|
|soucce-map|产生.map文件|
|cheap| 不包含列信息,也不包含loader的sourcemap|
|module | 包含loader的sourcemap,否则无法定义的源文件|
|inline| 将.map作为DataURL引入,不会单独生产.map文件 | 

![](/images/sourcemap.png)

缺少前面loader的sourcemap过程

::: tip 提示 
   :smiley: source-map包含行和列的信息,可以具体定位错误<br>
            cheap-source-map 只包含行,不包含列,定位到一行错误<br>
            开发环境推荐devtool:cheap-module-eval-source-map,没有列信息,但是快(eval),信息全(module)<br>
            生产环境推荐'hidden-source-map'可以生成sourcemap文件给错误收集工具,又不会为bundle添加引入注释,以免浏览器使用,此时行内链接DataURL到本地环境,方便调试
            折中使用eval-source-map 这是vue-cli使用的
:::


### 11 打包第三方类库

#### 11.1 安装

```js
npm install lodash - D
```


#### 11.2 使用

1. 直接引入,每次都要引入,很麻烦
```js
import _ from 'loadsh'
alert(_.join(['a','b','c'],'_'))
```
2. 插件引入
* webpack 配置providePlugin后,使用的时候无须import和require进行引入,直接使用即可
* _函数会自动化添加到当前模块的上下文,无需显示声明


```js
 const webpack  = require('webpack')

 plugins:[
   new webapck.ProvidePlugin({
     _:lodash
   })
 ]
```
此时全局下拿不到<br>
安装expose-loader
* 可以帮助我们把第三方类库挂载到window

```js
 module:{
   rules:{
     [
       {
         test:require.resolve('lodash'),
         loader:'expose_loader',
         options:{
           exposes:{
             globalName:'_',
             override:true
           }
         }
       }
     ]
   }
 }


```


3.CDN引入,但是用不用到都会引入,需要手动插入
如果我们通过CDN外链引入的方式引入了lodash库并且挂载到了_变量上
```js
 externals:{
   lodash:'_'
 }
 ```


```

4.引入 html-webpack-externals-plugin实现按需加载,而且可以自动在html引入cdn

```js

const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')

plugins:[
  new HtmlWebpackExternalsPlugin({
    externals:[
      module:'lodash',
      entry:  cnd地址,
      global:'_'
    ]
  })
]


```

### 12.开发环境和线上环境配置

* 环境变量有二个变量,一个是在模块内部使用的变量(mode),一个是在node进程环境中使用的webpack.config.js使用的变量,二个互不影响
  - 命令行配置
  - 可以通过--mode=development来改变mode值
  - 可以通过--env= development传参,传给webpack配置文件导出的函数参数

```js
 "script":{
   "build::"webpack --mode=development"
 }

```

* 如果在执行build,没有传--env==development,那么webpack导出的就拿不到参数,但是不影响mode,互不影响


```js
module.exports = (env) =>{
  console.log(env) //underfined
  return({
     devtool:'hidden-source-map',
     entry:'/src/index.js',
     ;;;
  })
}

```

* 但是传了全局也拿不到这个东西此时我们需要借助插件


```js
plugins:[
  new webpack.DefinePlugin({
    DEVELOPMENT:"true",
    ......
  })
]


```

我们可以全局安装cross-env,解决全局变量问题

```js 
scripts:{
  "build":"cross-env NODE_ENV=development webpack"
}
```


### 13. 配置多入口

```js
const path = require('path')
let pageRoot = path.resolve(__dirname,'src','pages');
let pages = fs.readdirSync(pagesRoots);
let htmlWebpackPlugin = []
let entry = pages.reduce((entry,filename) =>{
  let entryName = path.basename(filename,'js')
  entry[entryName] = path.join(pageRoot,filename);
  htmlWebpackPlugin.push(new HtmlWebpackPlugin({
    template:'./src/index/html',
    filename:`${entryName}.html`,
    //设置多页面默认入口
    // filename:`${entryName === 'page?':'index.html':entryName }.html`
    chunks:[entryName],//一个模块相互依赖组成了chunk
    minify:{
      collapseWhitespace:true,//开启压缩
      removeComments:true
    }
  }))
},{})




```


### 14.hash
* 入口模块依赖的模块组成了一个chunk
* 文件指纹,是指打包后输出文件的文件名和后缀
* hash一般是结合CDN缓存来使用的,通过webpack构建之后,生成对应文件名自动带上对应的MD5值,如果文件改变,那么对应文件的hash值也会改变,对应html引出的url地址也会改变,触发CDN服务器从源服务器上拉取对应数据,进而更新本地缓存

|  占位符  |   含义  | 
|:-------:|:-------:|
| ext | 资源后缀名 |
|name | 文件名称|
|hash | 每次webpack构建生成的唯一hash值 | 
| chunkhash | 每次根据chunk生成的hash值,来源自同一个chunk,则hash值一样,没有依赖的部分就能缓存,不会重新构建,只要是一个chunk的css和js改变,则会改变 | 
| contenthash | 根据内容生成的hash值,文件内容相同hash相同,文件改变才会改变 | 

* 如果内容变化快,建议hash,单入口
* 如果需要多个入口,建议chunkhash
* 长期缓存,内容变化不大,建议contenthash


## webpack 底层原理

### 1. webpack同步打包文件分析

#### 1.1 准备工作

* 模块的ID : 不管你是用什么样的路径来加载,最终模块的ID会变成相对根目录的相对路径



``` html
 - index.js => ./src/index.js
 - title.js => ./src/title.js
```

#### 1.2 过程分析

```js
(() =>{
// title.js 源代码
 var module = {
   './src/title.js':(module) =>{
     module.export = 'title'
   }
 }
 
  var cache = {};

  function require(moduleId){
    if(cache[moduleId]) { //先看缓存里面有没有已经缓存的模块对象
    return cache[moduleId].exports //如果有直接返回
   }
   var module = {
     exports:{}
   }
   cache[moduleId] = module //代码执行时候会给module.exports赋值
   //执行module里面的函数
    modules[moduleId].call(module.exports,module,module.exports,require);
    return module.exports //执行返回执行的exports就行了
  }
 // 主入口文件代码
 (() =>{
   let title = require('./title');
   console.log(title)

 })()


})()

```

### 2. webpack模块的兼容处理

* 主入口加载不同的模块

#### 2.1  commom.js加载commom.js

* 内容是上面webpack同步打包文件分析

#### 2.2 commom.js加载ES6 Modules
* index.js
```js
  let title = require('./title');
   console.log(title)
```

* title.js
```js
  exports.default "title.name";
  export const age = "title.age"
```
```js
(() =>{
// title.js 源代码
 var module = {
   './src/title.js':(module,exports,require) =>{
     // 代码有import 或者export webpack认定为es module
    // 不管是common.js 还是es module 最后都会编译成commom.js,如果原来是es module的话
    //就把expoets传给r方法处理一下,exports._esModule = true,以后通过这个属性判断原来是不是es6 模块
     module.export = 'title'

     require.r(exports) // 标识es6模块
     require.d(exports,{
       default:() => DEFAULT_EXPORT,
       age:() => 'age',
     })
     const DEFAULT_EXPORT = 'title.name'
     const age  = 'title.age'
   }
 }
 
  var cache = {};

  function require(moduleId){
    if(cache[moduleId]) { 
    return cache[moduleId].exports 
   }
   var module = {
     exports:{}
   }
   cache[moduleId] = module 

    modules[moduleId].call(module.exports,module,module.exports,require);
    return module.exports 
  }



  //新增方法r
   require.r = (exports) =>{
     // 这样通过打印 Object.prototype.call(exports); [object Module]
     // Symbol.toStringTag：在该对象上面调用Object.prototype.toString方法时，如果这个属性存在，它的返回值会出现在toString  方法返回的字符串之中，表示对象的类型
    //  class Person {
    //     get [Symbol.toStringTag]() {
    //         return 'Person';
    //     }
    //   }
    //   let p1 = new Person;
    //   console.log(Object.prototype.toString.call(p1)); //"[object Person]"

                           //目标对象     //属性          //值
     Object.defineProperty(exports,Symbol.toStringTag,{value:'module'})  //此操作就是赋值exports._esModule = true
   }
   
  // 新增方法d
  //循环转换成export 
  require.d = (exports,definition) =>{
    fo(let key in definition){
      //exports[key] = definition[key]
      //exports.age ...
      Object.defineProperty(exports,key,{enumerable:true,get:definition[key]})
    }
  }
 




 (() =>{
   let title = require('./title');
   console.log(title)

 })()


})()

```

::: tip 提示
 为什么webpack 打包声明的方法用一个字母?其他的名字很长 <br>
  减小文件体积
  原因是因为一般名称都能被压缩打包,但是对象的属性是不能被压缩的


:::

#### 2.3 ES6 Modules加载ES6 Modules

* 都分别处理一下,用r方法和d方法



#### 2.4 ES6 Modules加载commom.js
```js
//index.js新增方法n处理
 require.n = (exports) =>{
   var getter  = exports._esModule ? () => exports.default : () => exports
   return getter
 }

```

### 3. AST抽象语法树

* webpack是通过抽象语法树来实现对代码的检查和分析等操作
* 用途
  - 代码语法的检查,格式化等等
  - 代码混淆压缩
  - 不同代码规范质检的转换,jsx,ts转换成js

* 原理: 通过javaScript Parse把代码转成抽象语法书,这棵树定义代码结构,通过操作可以精准定位声明语句,运算等等对代码分析优化
   - 第一步先分词,把关键词转换成一个个token(词法分析)
   - 第二步转成抽象语法树(语法分析)


#### 3.1 JavaScript Parser

* JavaScript Parser,把js源码抓换成抽象语法树的解析器
* 浏览器会把js源码通过解析器转为抽象语法树,再进一步转换成字节码或者直接生成机器码

#### 3.2 常用的JavaScript Parser   esprima

* 通过<font color="red">esprima</font>把源码转换成AST
* 通过<font color="red">estraverse</font>遍历更新AST
* 通过<font color="red">escodegen</font>将AST重新生成源码
* [astexplorer](https://astexplorer.net/)  AST的可视化工具


#### 3.3 安装

```js
cnpm i esprima estraverse escodegen -S

```
#### 3.4 使用


```js
let esprima = require("esprima") //把源码转成抽象语法树
let estraverse = require("estraverse") 
let escodegen = require("escodegen")

let soureCode = `function ast(){}`
let ast = esprima.parse(soureCode)
let indent = 0
const padding = () => " ".repeat(indent)


//遍历语法树,深度优先
//如果一个遍历节点完成,同时有儿子和弟弟,如果先遍历弟弟,就是广度,先遍历儿子,就是深度
estraverse.traverse(ast,{
    enter(node){
      console.log(padding() + '进入' + node.type)    
      indent += 2         
    },
    leave(node){
     indent -= 2   
     console.log(padding() + '离开' + node.type)       
           
    }
})


let original = escodegen.generate(ast)
console.log(original)


```

### 4.实现箭头函数转换

* 利用插件babelPluginTransformEs2015ArrowFunctions

#### 4.1 安装
```js
cnpm i babel-plugin-transform-es2015-arrow-functions -D
```

#### 4.2 使用
```js


let core = require('@babel/core')
let types = require('babel-types')
let babelPluginTransformEs2015ArrowFunctions = require('babel-plugin-transform-es2015-arrow-functions')

 const sourceCode = `
  const sum = (a,b)=>{
      console.log(this)
      return a+b;
  }
`
//babel-code本身只用来生成语法树,遍历语法树,不负责转换语法树
let targetCode = core.transform(sourceCode,{
    plugins:[babelPluginTransformEs2015ArrowFunctions]
})

console.log(targetCode.code)

// var _this = this;

// const sum = function (a, b) {
//   console.log(_this);
//   return a + b;
// };


```


#### 4.3 手动实现babel-plugin-transform-es2015-arrow-functions


```js

let core = require('@babel/core')
let types = require('babel-types')


 const sourceCode = `
const sum = (a,b)=>{
    console.log(this)
    return a+b;
}
`
//babel 插件是一个对象,它会有一个vistor访问器
let babelPluginTransformEs2015ArrowFunctions2 = {
    visitor:{
       ArrowFunctionExpression(nodePath){ //参数是节点数据
          let node = nodePath.node //获取路径节点
          debugger
          const thisBinding = hoistFunctionEnvironment(nodePath);
         
          node.type = 'FunctionExpression'
       } 
    }
}



function getScopeInfoInformation(fnPath){
     let thisPaths = []
     fnPath.traverse({ //遍历当前的path所有子节点,看看谁的类型是ThisExpression
         ThisExpression(thisPath){
            thisPaths.push(thisPath)
         }
     })
     return thisPaths
}
function hoistFunctionEnvironment(fnPath){

    //thisEnvFn==Program,找到根节点
   const thisEnvFn = fnPath.findParent( p =>{
       return (p.isFunction() && !p.isArrowFunctionExpression) || p.isProgram()
   })
 
//    console.log(thisEnvFn)

   //thisPaths放着哪些地方用到this
   let thisPaths = getScopeInfoInformation(fnPath)
   let thisBinding = '_this';
   if(thisPaths.length > 0){
       //在父节点作用域添加一个变量id _this,初始值   this => thisExpression
    thisEnvFn.scope.push({
        id:types.identifier(thisBinding),
        init:types.thisExpression()
    })
   }
   //遍历所有用到this路径节点,把所有thisExpression变成_this标识符
   thisPaths.forEach(thisChild =>{
       let thisRef = types.identifier(thisBinding)
       thisChild.replaceWith(thisRef)
   })


}

//babel-code本身只用来生成语法树,遍历语法树,不负责转换语法树
let targetCode = core.transform(sourceCode,{
    plugins:[babelPluginTransformEs2015ArrowFunctions2]
})

console.log(targetCode.code)


```

### 5.webpack 工作流

#### 5.1 webpack编译流程
1. 初始化参数,从配置文件和shell语句中读取合并参数,得到最终的配置对象
2. 用上一步的到的参数初始化Compiler对象
3. 加载所有配置的插件
4. 执行对象的run方法开始编译
5. 根据配置中的entry找到入口文件
6. 从入口文件出发,调用所有配置的loader对模块进行编译
7. 再递归本步骤直到所有入口依赖的文件都经过本步骤处理(找到所有依赖)
8. 根据入口和模块之间的关系,组装成一个个包装多个模块的chunk
9. 确定好输出内容后,根据配置和输出路径和文件名,把内容写进文件系统

```js
let {Synchook} = require('tapable)
const path = require('path)'
const fs = require('fs');

const parser = require('@/babel/parser'); //解析器 源代码转成AST抽象语法树
const types = require("babel-types") //生成节点
const traverse = require('@/babel/traverse') //遍历语法树器
const generator = require("@/babel/generator").default //语法树重写生成代码

//webpack内部用的是acorn

class Compiler{
  constructor(option){
      this.option = option
      this.hooks = {
        run: new Synchook() //开始编译时候触发
        done:new Synchook() //会在完成编译的时候触发
      }
  }
  //4. 执行对象的run方法开始编译
  run(){
    let modules = []
    this.hooks.run.call()//执行run方法的时候触发run钩子,进而执行它的回调函数

  // 5. 根据配置中的entry找到入口文件
   // context:process.cwd() 根目录
   let entry = path.join(this.option.context,this.options.entry)

     //6 从入口文件出发,调用所有配置的loader对模块进行编译
   let  entryModule = buildModule(entry)
   // 7.再递归本步骤直到所有入口依赖的文件都经过本步骤处理(找到所有依赖)
   entryModule.dependencies.foreach(dependency =>{
     let dependencyModule = this.buildModule(dependency)]
     modules.push(dependencyModule)
   })
   //8. 根据入口和模块之间的关系,组装成一个个包装多个模块的chunk
   let chunk = {name:'main',entryModule,module:this.modules};
  //再把每个chunk转换成一个单独文件加入到输出列表
   this.chunks.forEach(chunk =>{
    //  this.assets[chunk.name + 'js'] = getsource(chunk) 假设只有一个chunk.后面就是内容
   })
   //9. 确定好输出内容后,根据配置和输出路径和文件名,把内容写进文件系统
   for(let file in this.assets){
     fs.writeFileSync(`./dist/${file}`,assets[file])
   }
   this.hooks.done.call()
  }
  buildModule(modulePath){
   //读取原始代码
   let originalSourceCode = fs.readFileSync(modulePath,'uft-8')
   //查找loader对代码你进行转换
   let rules = this.option.module.rules
   let loaders = []
   for( let i = 0; i < rules.length; i++){
     //正则匹配上模块的路径
     if(rules[i].test.test(modulePath){
       loaders = [...loaders,...rules[i].use]
     })
   }
   for(let i= loaders.length- 1 ; i>=0; i--){
     let loader = loader[i]
     //loader函数
    //  function loader(source){
    
    //   }
  
     //把上一个loader处理结果交给下一个loader
     let  targetSourceCode = require(loader)(targetSourceCode)
     let baseDir = process.cwd().replace(/\\/g,'/')
     //现在已经得到转换后的代码 babel-loader es6 =>es5
     //再找出该模块依赖的模块,再递归本步骤之道所有入口依赖的文件都经过了本步骤的处理
     let moduleId = './' + path.posix.relative(baseDir,modulePath)
       let module = {id:moduleId,dependenices:[]};
     let  astTree = parse.parse(targetSourceCode,{sourceType:'module'});
     traverse(astTree,{
       CallExpression({node}){
         if(node.callee.name === 'require'){
            let moduleName = node.argument[0].value
            let dirname = path.posix.dirname(modulePath)
            let depModulePath = path.posix.join(dirname,moduleName);
            let extnsion = this.options.reslove.extension
             depModulePath = tryExtensions(depModulePath,extensions,moduleName,dirname)
             //模块Id问题
             let depModuleId = './' + path.posix.relative(baseDir,depModulePath)
             //修改抽象语法树
             node.arguments = [types.stringLiteral(depModuleId)]
             module.dependencies.push(depModulePath)
         }
       }
     })
     //根据新的语法树生成新代码
     let {code} = generator(astTree)
     module._souce = code
   }
  }
  //模块id是此模块绝对路径相当于根目录的相对路径
  function tryExtensions(modulePath,extensions,originalModulePath,moduleContext){
    for(let i = 0; i < extension.length; i++){
       if(fs.existSync(modulePath+extension[i])){
         return modulePath+extension[i]
       }
    }
  }
}
module.exports = Compiler

```

* 插件
```js
class DonePlugin{
  constructor(options){
    this.options = options
  }

  apply(compiler){
    //注册监听感兴趣的钩子
     compiler.hooks.run.tap('DonePlugin',() =>{
       console.log('111')
     })
    //   compiler.hooks.done.tap('DonePlugin',() =>{
    //    console.log('111')
    //  })
  }
}
module.exports = DonePlugin

```

```js
let Compiler = require('./Compiler)
function webpack(option){
 //初始化参数,从配置文件和shell语句中读取和合并参数,得到最终的配置对象
 // process.argv 命令行参数 数组 ( 1.node.exe绝对路径 , 2.脚本路径,   3.参数--mode=***,)
 process.argv.slice(2).reduce((shellConfig,item) =>{
   let [key,value] = item.split("=")  //--mode=development
   shellConfig[key.slice(2)] = value
   return shellConfig
 },{})
 let finalOption = {...option,...shellConfig}

  //2. 用上一步的到的参数初始化Compiler对象
  let compiler = new Compiler(finalOption)

 // 3. 加载所有配置的插件(一开始就挂载了)
 //执行是找到对应的钩子才会执行
   if(finalOption.plugins && Array.isArray(inalOption.plugins)){
     for(let plugin of finalOption.plugins){
       plugin.apply(Compiler)
     }
   }
  return compiler
}
module.exports = webpack


```

```js
const webpack = require('./webapck')
const option = require('./webpack.config')
//执行webpack得到核心编译对象Compiler,就是一个大管理,是核心编译对象
const  compiler = webpack(option);
compiler.run()

```



